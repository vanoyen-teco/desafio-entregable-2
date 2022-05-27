/*
Declaracion inicial
*/
let totalIteration;
let inicio = 1;
let totalBill = 0;
let factura = false;
let tableContent = '';
let inputContent;
let producto;
const button = document.getElementById("btnEnviar");
const productos = new Array();
/*
Funciones
*/
function setCantidad(){
    changeInnerHtml("formLabelDatos", `Ingrese cantidad de productos`);
    totalIteration = parseInt(returnInput());
    if(validateNumber(totalIteration) && totalIteration > 0){
        //button.removeEventListener('click', setCantidad);
        setProductos();
        button.onclick =  productosPasos;
    }else{
        inputError(false);
    }
}
function validateNumber(number){
    if(number === "" || number === undefined || number === null || isNaN(number)){
        return false;
    }else{
        return true;
    }
}
function validateFcType(){
    tipo = document.getElementById("campoDatos").value;
    tipo = tipo.toLowerCase().trim();
    if(tipo == "a" || tipo == "b"){
        printFactura();
        return true;
    }else{
        inputError(false);
        return false;
    }
}
function ucfirst(cadena){
    let primera = cadena.charAt(0).toUpperCase();
    cadena = cadena.slice(1);
    return primera + cadena;
}
function returnInput(){
    inputContent = document.getElementById("campoDatos").value;
    return inputContent;
}
function changeInnerHtml(id, datos){
    document.getElementById(`${id}`).innerHTML = datos;   
}
function inputError(estado){
    if(estado){
        document.getElementById('campoDatos').classList.remove("is-invalid");
    }else{
        document.getElementById('campoDatos').classList.add("is-invalid");
    }
}
function productosPasos(){
    eventProducto();
}
function setProductos(){
    inputError(true);
    document.getElementById("campoDatos").value = '';
    if(inicio <= totalIteration){
        changeInnerHtml("formLabelDatos", `Ingrese nombre del producto Nº ${inicio}`);
        eventProducto();
    }else{
        finalProductos();
    }
}
function eventProductoPrecio(){
    number = returnInput();
    if(validateNumber(number)){
        productos.push({nombre: `${producto}`, cantidad: 1, precio: number});
        inicio++;
        //button.removeEventListener('click', eventProductoPrecio);
        button.onclick = productosPasos;
        setProductos();
    }else{
        console.log('no valido');
        if(number != ''){
            inputError(false);
        }
    }
}
function eventProducto(){
    producto = returnInput();
    producto = producto.toLowerCase();
    if(producto != ''){
        let itemIndex = productos.findIndex( item => item.nombre === producto);
        if(itemIndex == -1){
            // primer ingreso del item, solicito el precio.
            document.getElementById("campoDatos").value = '';
            changeInnerHtml("formLabelDatos", `Ingrese precio del producto ${inicio}`);
            //button.removeEventListener('click', productosPasos);
            button.onclick = eventProductoPrecio;
            //
        }else{
            // sumo uno ya que el item se encuentra en el "carro";
            productos[itemIndex].cantidad = productos[itemIndex].cantidad + 1;
            inicio++;
            setProductos();
        }
    }else{
        inputError(true);
    }    
}

function finalProductos(){
    // calculo final
    productos.forEach(item => {
        totalBill += item.cantidad * item.precio;
        tableContent += `
        <tr>
            <td>${ucfirst(item.nombre)}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio * item.cantidad}</td>
        </tr>
        `;
    });

    // agrego filas a la tabla
    if(tableContent != undefined){
        document.getElementById("tbody-container").innerHTML = tableContent;
    }
    changeInnerHtml("formLabelDatos", 'Tipo de factura: ingrese A o B');
    //document.getElementById("campoDatos").value = '';
    button.onclick = validateFcType;
}

function printFactura(){
    let ivaDisc = (totalBill * 21)/100;
    if(factura == 'b'){
        let footer = document.querySelector("#tfoot-container");
        footer.innerHTML = `
        <tr>
            <td>El total es:</td>
            <td colspan="2">$${totalBill + ivaDisc}</td>
        </tr>    
        `;
    }else{
        let footer = document.querySelector("#tfoot-container");
        footer.innerHTML = `
        <tr>
            <td>Subtotal: $${totalBill}</td>
            <td>IVA: $${ivaDisc}</td>
            <td>El total es: $${totalBill + ivaDisc}</td>
        </tr>    
        `;
    }

    // Adapto la vista.
    document.querySelector(".vista-previa").classList.add("d-none");
    let ocultar = document.querySelectorAll(".cart-title, .final, #table-container");
    ocultar.forEach(function(element) {
        element.classList.remove('d-none');
    });
}

/*Listeners*/
document.getElementById("form-datos").addEventListener('submit', (e) => {
    e.preventDefault();
});
document.getElementById("campoDatos").addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        button.click();
    }
})
/*Start app*/
button.onclick = setCantidad;
document.getElementById('btnRestart').onclick = () => {location.reload()};
