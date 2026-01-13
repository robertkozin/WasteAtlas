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

// FILTROS
function setupFilters() {
  let activeFilter = null

  var directoryItem = document.querySelectorAll(".directory-card")
  var filterButtons = document.querySelectorAll(".filter-btn")

  filterButtons.forEach(button => {
    button.addEventListener("click", function () {
      var filterValue = this.getAttribute("data-filter")
    })
    function filterCards(tag) {
      cards.forEach(card => {
        const cardTag = card.getAttribute("data-tags")
        if (cardTag === tag) {
          card.style.display = "flex"
        } else {
          card.style.display = "none"
        }
      })
    }
  })
}

function showAllCards() {
  cards.forEach(card => {
    card.style.display = "flex"
  })
}

/*ejcutar cuando pag carga */
document.addEventListener("DOMContentLoaded", setupFilters)
