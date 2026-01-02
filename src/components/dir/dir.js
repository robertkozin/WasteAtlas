console.log ('he')
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
window.applyfilter = applyfilter
