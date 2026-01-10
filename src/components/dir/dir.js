/*funcionalidad de filtrar */

/*console.log ('he')
function applyfilter(){
    let items=document.querySelectorAll ('.item')
    for(const item of items){
        console.log( item.innerHTML)
        let content = item.innerHTML
        if (content.includes("industrial")) {
            continue 
        } else {
            item.style.display = "none"  
        }
    } 
}
window.applyfilter = applyfilter*/

function setupFilters () { /*funcion ppal que organiza todo */
    let activeFilter = null

    const filterButtons = documen.querySelectorAll ('.filter-btn') /*busca los btn de filtro */
    const cards = document.querySelectorAll ('.directory-card') /*busca las cards */

    filterButtons.forEach (BUTTON => {
        BUTTON.addEventListener ('click', function (){ /*escuha cuando clic en btn */
            const filterValue = this.getAttribute ('data-filter')

            if (filterValue) {
                if (activeFilter === filterValue) {
                    activeFilter = null
                    showAllCards ()
                } else {
                    activeFilter = filterValue
                    filterCards(filterValue)
                }
            }
        })
    })
}

 function filterCards(category) { /*oculta las cards que NO coinciden */
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category')
      if (cardCategory === category) {
        card.style.display = 'flex'
      } else {
        card.style.display = 'none'
      }
    })
  }

  function showAllCards() {
    cards.forEach(card => {
      card.style.display = 'flex'
    })
  }

  /*ejcutar cuando pag carga */
  document.addEventListener('DOMContentLoaded', setupFilters)



