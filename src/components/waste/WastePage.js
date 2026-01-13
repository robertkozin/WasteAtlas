var project_info = document.querySelector("#project_info")
var property_info = document.querySelector("#property_info")

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

window.toggle = toggle

// //hover cambiod e color
// var botton_hover = document.querySelector(".boton_propiedades")
// botton_hover.onmouseover = function () {
//   this.style.borderColor = "${colours.sub}"
//   this.style.fontColor = "${colours.sub}"
// }

// FILTROS

function setupFilters() {
  //mira que filtros están activos a empezar el programa
  let activeFilter = null
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

      // enciendes un filtro que está en el bottón
      activeFilter = filterValue

      // aplicas la variable de filtevalue en la función de filtercards
      filterCards(filterValue)

      // Optional: Update button active states
      filterButtons.forEach(btn => {
        btn.classList.remove("active")
      })
      this.classList.add("active")
    })
  })
}

document.addEventListener("DOMContentLoaded", setupFilters)
