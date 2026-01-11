
var project_info = document.querySelector("#project_info")
var property_info = document.querySelector("#property_info")

//cuando click en boton mostrar el panel de filtro Y cuando click en botón filtrar
function toggle () {
  if(project_info.hidden==true){
    project_info.hidden=false;
    property_info.hidden=true;
  } else{
    project_info.hidden=true;
    property_info.hidden=false;
  }
}

window.toggle=toggle;
//cuando click en BACK ocultar panel de filtro

//cuando click en directory item abrir pagina nueva
