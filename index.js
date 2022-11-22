let botones_comprar = document.querySelectorAll(".btn-comprar");

for (let boton of botones_comprar){
    boton.addEventListener("click", agregar_a_carrito)
}

function agregar_a_carrito(event) {
    
    let button = event.target;
    let card_body = button.parentNode;
    let card = card_body.parentNode;

    let nombre_producto = card_body.querySelector("h5").textContent;
    let precio_producto = card_body.querySelector(".precio").textContent;
    let imagen_producto = card.querySelector("img").src;

    

    let producto = {
        nombre: nombre_producto,
        precio: parseFloat(precio_producto.replace(/\D/g,'')),
        imagen: imagen_producto,
        cantidad: 1,
    };

    let carrito = obtener_carrito();
    let producto_existente = carrito.find(x => x.nombre == producto.nombre);
    console.log(producto_existente);
    if (producto_existente==undefined){
        carrito.push(producto);
        console.log(producto);
    }
    else{
        producto_existente.cantidad++;
    }
    console.log(carrito);
    

    guardar_carrito(carrito);
    
    mostrar_carrito(carrito);

    Swal.fire({
        icon: 'success',
        title: producto.nombre + ' agregado(a) al carrito',
        showConfirmButton: false,
        timer: 1500
      });
}

function mostrar_carrito (carrito) {
    let tabla = document.getElementById("table-body");
    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }
    
    for (let producto of carrito) {
        let fila = document.createElement("tr");
        fila.innerHTML= ` <td>${producto.nombre}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.precio}</td>
                    <td><button class="btn btn-danger borrar_elemento">Borrar</button></td>`;    
        tabla.append(fila); 
    }

    let btn_borrar = document.querySelectorAll(".borrar_elemento");

    for( let boton of btn_borrar){

        boton.addEventListener("click", borrar_producto);
    }
}

function borrar_producto(e) {
    let row = e.target.parentNode.parentNode;
    let nombre_producto = row.querySelector("td").textContent;
    let carrito = obtener_carrito();
    let p = carrito.find(x => x.nombre == nombre_producto);
    let index = carrito.indexOf(p);
    carrito.splice(index, 1);
    guardar_carrito(carrito);
    row.remove();
}

function obtener_carrito() {
    let carrito_JSON = localStorage.getItem("carrito"); 
    if (carrito_JSON == null) {
        return [];
    }
    else{
        return JSON.parse(carrito_JSON);
    }
}

function guardar_carrito(carrito) {
    let carrito_JSON = JSON.stringify(carrito); 
    localStorage.setItem("carrito", carrito_JSON);
}


mostrar_carrito(obtener_carrito());

//Funcion vaciar carrito//
function vaciarCarrito() {
    localStorage.clear("carrito")
    mostrar_carrito([]);
}

let vaciarCarritoBTN = document.getElementById("vaciarCarrito");
vaciarCarritoBTN.addEventListener("click", vaciarCarrito);

//Clima y geolocalizacion//

let api_key = "b0d179d6194ebdce644424c11e086065";

navigator.geolocation.getCurrentPosition(showPosition)


function showPosition(position){


    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    fetch("https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&lang=es&units=metric&appid="+api_key)
    .then(response=>response.json())
    .then(data=>{
            let wheater = document.getElementsByClassName("wheater")[0];
            wheater.innerHTML = `
                                <p>${data.name}, ${data.sys.country}</p>
                                <p>${data.main.temp}°</p>`;
    })
}

//Boton Finalizar Compra//
function finalizarCompra() {
    let productos= obtener_carrito();
    let total = productos.reduce((accu, producto) => accu + (producto.precio*producto.cantidad), 0);
    let cantidadProductos = productos.reduce((accu, producto) => accu + producto.cantidad, 0);
    let confimacion = Swal.fire({
        title: '<strong>Felicitaciones por su compra!</strong>',
        icon: 'success',
        html:
          `Usted debe abonar <b>$${total}</b> `+
          `<br>`+
          `Cantidad de prendas: <b>${cantidadProductos}</b> `,
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText:
          'Confirmar',
      });
      confimacion.then((result) => {
        if (result.isConfirmed) {
          vaciarCarrito();
        } 
      })
}
let finalizarCompraBTN = document.getElementById("finalizarCompra");
finalizarCompraBTN.addEventListener("click", finalizarCompra);