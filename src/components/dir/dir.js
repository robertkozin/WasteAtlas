console.log ('hello')
function filter(){
    let items=document.querySelectorAll ('.item')
    for(const item of items){
        console.log( item.innerHTML)
    } 
}