//import maplibre from "maplibre-gl";
import maplibre from "mapbox-gl";
//import "maplibre-gl/dist/maplibre-gl.css";
import "mapbox-gl/dist/mapbox-gl.css";
import createFuzzySearch from "@nozbe/microfuzz";

// Add types for the global window object
declare global {
  interface Window {
    mapInstance: maplibre.Map;
  }
}

maplibre.accessToken =
  "pk.eyJ1Ijoicm9iZXJ0a296aW4iLCJhIjoiY205aXVteWgyMDY0dDJsczZqNGtpbzJqNSJ9.sHenifCidutvMSNZquNWdA";
const map = new maplibre.Map({
  container: "map",
  //style: "https://api.maptiler.com/maps/dataviz/style.json?key=bLo8xe0MLrejy29a8JsL",
  // style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  style: "/map/stylev5.json",
  center: [0, 40],
  zoom: 1.3,
  maxZoom: 9,
  renderWorldCopies: true,
  hash: true,
  //maplibreLogo: false,
  attributionControl: false,
  keyboard: false,
  doubleClickZoom: true,
  dragRotate: false,
  dragPan: true,
  touchZoomRotate: false,
});
//map.addControl(new maplibre.AttributionControl(), "bottom-left");

// Store map instance globally for filter access
window.mapInstance = map;

let $titlearea = document.querySelector(".title-area");
map.on("move", () => {
  if ($titlearea?.classList.contains("open")) {
    $titlearea.classList.remove("open");
  }
});

let heatLayers = [
  "heatmap_construction",
  "heatmap_agricultural",
  "heatmap_domestic",
  "heatmap_industrial",
];

map.on("load", () => {
  map.addSource("waste", {
    type: "geojson",
    data: "./data/points.geojson",
  });

  map.addSource("blobs", {
    type: "geojson",
    data: "./data/blobs.geojson",
  });

  let rad: maplibre.DataDrivenPropertyValueSpecification<number> = [
    "interpolate",
    ["exponential", 2],
    ["zoom"],
    0,
    6,
    8.9,
    190,
  ];

  let opacity: maplibre.DataDrivenPropertyValueSpecification<number> = [
    "interpolate",
    ["linear"],
    ["zoom"],
    7,
    0.6,
    8,
    0.1,
  ];

  function color(hex: string): maplibre.ExpressionSpecification {
    return [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0,
      hexa(hex, 0),
      0.6,
      hexa(hex, 0),
      0.7,
      hexa(hex, 1),
      1,
      hexa(hex, 1),
    ];
  }

  function rgba(hexa: string): string {
    hexa = hexa.replace("#", "");
    let r = parseInt(hexa.substring(0, 2), 16);
    let g = parseInt(hexa.substring(2, 4), 16);
    let b = parseInt(hexa.substring(4, 6), 16);
    let a = parseInt(hexa.substring(6, 8), 16) / 255;
    a = Math.round(a * 100) / 100;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  function hexa(hex: string, alpha: number = 1): string {
    return rgba(
      hex +
        Math.round(alpha * 255)
          .toString(16)
          .padStart(2, "0"),
    );
  }

  map.addLayer(
    {
      id: "heatmap_domestic",
      type: "heatmap",
      source: "blobs",
      filter: ["==", ["get", "cat"], "domestic"],
      paint: {
        "heatmap-radius": rad,
        "heatmap-intensity": 1,
        "heatmap-opacity": opacity,
        "heatmap-color": color("#9967CA"),
      },
    },
    "place_village",
  );

  map.addLayer(
    {
      id: "heatmap_construction",
      type: "heatmap",
      source: "blobs",
      filter: ["==", ["get", "cat"], "construction"],
      paint: {
        "heatmap-radius": rad,
        "heatmap-intensity": 1,
        "heatmap-opacity": opacity,
        "heatmap-color": color("#FC4008"),
      },
    },
    "place_village",
  );

  map.addLayer(
    {
      id: "heatmap_agricultural",
      type: "heatmap",
      source: "blobs",
      filter: ["==", ["get", "cat"], "agricultural"],
      paint: {
        "heatmap-radius": rad,
        "heatmap-intensity": 1,
        "heatmap-opacity": opacity,
        "heatmap-color": color("#979C35"),
      },
    },
    "place_village",
  );

  map.addLayer(
    {
      id: "heatmap_industrial",
      type: "heatmap",
      source: "blobs",
      filter: ["==", ["get", "cat"], "industrial"],
      paint: {
        "heatmap-radius": rad,
        "heatmap-intensity": 1,
        "heatmap-opacity": opacity,
        "heatmap-color": color("#A1A1A1"),
      },
    },
    "place_village",
  );

  map.addLayer({
    id: "waste",
    type: "circle",
    source: "waste",
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 20, 15],
      "circle-color": [
        "match",
        ["get", "category"],
        "domestic",
        "#9967CA", // Purple
        "construction",
        "#FC4008", // Red
        "commercial",
        "#FC4008", // Red
        "agricultural",
        "#979C35", // Green
        "industrial",
        "#A1A1A1", // Grey
        "#ffffff", // Default color for any other category
      ],
      "circle-opacity": 1,
    },
  });

  map.on("click", "waste", (e) => {
    const feature = e.features[0];
    const props = feature.properties;
    const coordinates = feature.geometry.coordinates.slice();
  });

  map.on("mouseenter", heatLayers, () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", heatLayers, () => {
    map.getCanvas().style.cursor = "";
  });

  let $waste = document.querySelector(".waste");

  let clickHeat = false;
  map.on("click", (e) => {
    const heatmapFeatures = map.queryRenderedFeatures(e.point, {
      layers: heatLayers,
    });

    if (heatmapFeatures.length === 0) {
      if (clickHeat) {
        if ($waste?.classList.contains("open")) {
          $waste?.classList.remove("open");
        }
        applySearch();
      }
      clickHeat = false;
      return;
    }

    let wasteIds = new Set();
    for (const feature of heatmapFeatures) {
      wasteIds.add(feature.properties.w.toString());
    }

    if (wasteIds.size === 0) return;

    let results = Array.from(
      document.querySelectorAll<HTMLElement>(".list .item"),
    ).filter((item) => wasteIds.has(item.dataset.id));
    let $listul = document.querySelector(".list ul");

    results.forEach((result) => {
      $listul?.appendChild(result);
      result.hidden = false;
    });

    let children = $listul.children;
    for (let i = 0, n = children.length - results.length; i < n; i++) {
      children[i].hidden = true;
    }

    if (!$waste?.classList.contains("open")) {
      $waste?.classList.add("open");
    }

    clickHeat = true;
  });
});

const fuzzySearch = createFuzzySearch(
  document.querySelectorAll<HTMLElement>(".list .item").values().toArray(),
  {
    getText: (e) => [
      e.dataset.name,
      e.dataset.loc,
      e.dataset.char,
      e.dataset.cat,
    ],
  },
);

let $waste = document.querySelector(".waste");
let $list = document.querySelector(".list");
let $listul = document.querySelector(".list ul");
let $listitems = document.querySelectorAll<HTMLElement>(".waste .list .item");
let $listbutton = document.querySelector(".list button");

let query = "";

document.querySelector(".search")?.addEventListener("input", (e) => {
  query = (e.target as HTMLInputElement).value;

  if (!$waste?.classList.contains("open")) {
    $waste?.classList.add("open");
  }

  applySearch();
});

function applySearch() {
  let fzz = fuzzySearch(query);

  let results = fzz.filter((result) => result.score <= 3).map((r) => r.item);
  if (results.length === 0) {
    results = $listitems
      .values()
      .toArray()
      .sort((a, b) => {
        return parseInt(a.dataset.order) - parseInt(b.dataset.order);
      });
  }

  // console.log(...activeFilters);
  if (activeFilters.size > 0) {
    // console.log("results", results)
    results = results.filter((result) => {
      // console.log("cat", result.dataset.cat);
      return activeFilters.has(result.dataset.cat);
    });
  }

  if (true) {
    //console.log(results);

    results.forEach((result) => {
      $listul?.appendChild(result);
      result.hidden = false;
    });

    let children = $listul.children;
    for (let i = 0, n = children.length - results.length; i < n; i++) {
      children[i].hidden = true;
    }

    let ids = results.map((r) => parseInt(r.dataset.id));
    // console.log("ids", ids);

    map.setFilter("waste", [
      "in",
      ["id"],
      ["array", "number", ids.length, ["literal", ids]],
    ]);

    heatLayers.forEach((l) => {
      map.setFilter(l, [
        "all",
        ["==", ["get", "cat"], l.slice(8)],
        ["in", ["get", "w"], ["array", "number", ids.length, ["literal", ids]]],
      ]);
    });
  } else {
    // TODO: SORT
    let q = document.querySelectorAll<HTMLElement>(".waste .list .item");
    let els = q
      .values()
      .toArray()
      .sort((a, b) => {
        return parseInt(a.dataset.order) - parseInt(b.dataset.order);
      });
    els?.forEach((el) => {
      $listul?.appendChild(el);
      el.hidden = false;
    });
    map.setFilter("waste", null);
    heatLayers.forEach((l) => {
      map.setFilter(l, ["==", ["get", "cat"], l.slice(8)]);
    });
  }
}

// Filter functionality
const $filterButtons = document.querySelectorAll(".filter button");
const activeFilters = new Set(); // Track active category filters

// Add click event listeners to filter buttons
$filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    if (!category) {
      return;
    }

    // Toggle active state
    if (button.classList.contains("active")) {
      button.classList.remove("active");
      activeFilters.delete(category);
    } else {
      button.classList.add("active");
      activeFilters.add(category);
    }

    applySearch();
  });
});

// The welcome box functionality
let ack = window.localStorage.getItem("ack");
let ackAt = parseInt(ack || "0") || 0;
let nowSeconds = Date.now() / 1000;
let monthSeconds = 60 * 60 * 24 * 30;
if (ackAt + monthSeconds < nowSeconds) {
  document.querySelector(".title-area")?.classList.add("open");
  window.localStorage.setItem("ack", Date.now().toString());
}

// Generic functionality to make toggleable elements
document.querySelectorAll<HTMLElement>("[data-open]").forEach((el) => {
  let targetEl = document.querySelector(el.dataset.open);

  el.addEventListener("click", (ev) => {
    if (targetEl instanceof HTMLDialogElement) {
      targetEl.open ? targetEl.close() : targetEl.showModal();
    } else {
      targetEl?.classList.toggle("open");
    }
  });
});
