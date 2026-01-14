var project_info = document.querySelector("#project_info")
var property_info = document.querySelector("#property_info")
var botonCierre = document.querySelector(".filtro-cierre")

//cuando click en boton mostrar el panel de filtro Y en BACK ocultar panel de filtro
function toggle(tag = "") {
  console.log("tag:", tag)
  if (project_info.hidden == true) {
    project_info.hidden = false
    property_info.hidden = true
  } else {
    project_info.hidden = true
    property_info.hidden = false
  }
}

// FILTROS

function setupFilters() {
  //crea una lista de los botones y de las cards
  const directoryItems = document.querySelectorAll(".directory-card")
  const filterButtons = document.querySelectorAll(".filter-btn")

  // Para cada card en directory items le busca las data-tags
  function filterCards(tag) {
    directoryItems.forEach(card => {
      const cardTags = card.getAttribute("data-tags")

      // opciones: si el boton son todas las tags enseña todas las cards
      if (!tag || tag === "all" || (cardTags && cardTags.includes(tag))) {
        //, si el boton INCLUYE una tag
        card.style.display = "flex" //enseña las tarjetas con dicha tag
      } else {
        card.style.display = "none" //y si no las oculta
      }
    })
  }

  // Evento de los filtros
  filterButtons.forEach(button => {
    button.addEventListener("click", function () {
      const filterValue = this.getAttribute("data-filter")
      const closedButton = button.classList.contains("filtro-cierre")
      const panelOpen = property_info.hidden == false
      if (panelOpen && closedButton) {
        toggle(filterValue)
        filterButtons.forEach(btn => {
          btn.classList.remove("active")
        })
      } else if (!panelOpen && !closedButton) {
        botonCierre.innerHTML = filterValue
        toggle(filterValue)
        this.classList.add("active")
        botonCierre.scrollIntoView({ behavior: "smooth", block: "center" })
        // aplicas la variable de filtevalue en la función de filtercards
        filterCards(filterValue)
      }
    })
  })
}

document.addEventListener("DOMContentLoaded", setupFilters)
