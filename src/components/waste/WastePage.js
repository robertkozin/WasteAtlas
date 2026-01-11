
//cambiar el color de los botones on hover
document.getElementsByClassName("boton_propiedades").addEventListener("hover", (event) =>{ 
 button.style.borderColor = colours.sub; //mal :-)
}, false);

//cuando click en boton mostrar el panel de filtro Y cuando click en botón filtrar
function toggle (waste_info, property_info) {
  hide(document.getElementById(waste_info).innerHTML);
  show(document.getElementById(property_info).innerHTML);
}

//cuando click en BACK ocultar panel de filtro
function toggle2 (property_info, waste_info) {
  hide(document.getElementById(property_info).innerHTML);
  show(document.getElementById(waste_info).innerHTML);
}
//cuando click en directory item abrir pagina nueva
