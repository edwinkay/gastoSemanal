// Variables y Selectores
const formulario = document.getElementById('agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');


// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
    
}

// Classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
        // console.log(this.restante);
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        console.log(this.gastos);
        this.calcularRestante();
    }
}

class UI {

    insertarPresupuesto( cantidad ) {
     document.querySelector('#total').textContent = cantidad.presupuesto;
     document.querySelector('#restante').textContent = cantidad.restante;
    }
    
    imprimirAlerta(mensaje, tipo) {
        // Crea el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        // Si es de tipo error agrega una clase
        if(tipo === 'error') {
             divMensaje.classList.add('alert-danger');
        } else {
             divMensaje.classList.add('alert-success');
        }
        // Mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el DOM
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // Quitar el alert despues de 3 segundos
        setTimeout( () => {
             document.querySelector('.primario .alert').remove();
        }, 1200);
   }

    // Inserta los gastos a la lista 
    mostarGastos(gastos) {

        // Limpiar HTML
        this.limpiarHTML();//activate this

        // Iterar sobre los gastos 
        gastos.forEach(gasto => {
            const {nombre, cantidad, id } = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // Insertar el gasto
            nuevoGasto.innerHTML = `
                ${nombre}
                <span class="badge badge-primary badge-pill">$ ${cantidad}</span>
            `;

            // boton borrar gasto.
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');

            btnBorrar.innerHTML = 'Borrar &times'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }


            nuevoGasto.appendChild(btnBorrar);



            // Insertar al HTML
            gastosListado.appendChild(nuevoGasto);
        });
   }
   limpiarHTML(){
       while (gastosListado.firstChild) {
           gastosListado.removeChild(gastosListado.firstChild);
       }
   }

   actualizarRestante(restante){
       document.querySelector('#restante').textContent = restante;
   }
   comprobarPresupuesto(presupuestoObj){
       const {presupuesto, restante} = presupuestoObj;


       const restanteDiv = document.querySelector('.restante');

       

       //comprobar el 25%
       if( (presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }


        if(restante <= 0 ) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        } 

   }

}



const ui = new UI();
let presupuesto;

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    if( presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {
        window.location.reload();
    }

    // Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);

    // console.log(presupuesto);

    // Agregarlo en el HTML
    ui.insertarPresupuesto(presupuesto)
}


function agregarGasto(e) {
    e.preventDefault();

     // Leer del formulario de Gastos
     const nombre = document.querySelector('#gasto').value;
     const cantidad = Number( document.querySelector('#cantidad').value);

     // Comprobar que los campos no esten vacios
     if(nombre === '' || cantidad === '') {
          // 2 parametros: mensaje y tipo
          ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
     } else if(cantidad <= 0 || isNaN(cantidad )) {

          // si hay una cantidad negativa o letras...
          ui.imprimirAlerta('Cantidad no válida', 'error')
     } else {
            const gasto = { nombre, cantidad, id: Date.now() };

            // Añadir nuevo gasto 
            presupuesto.nuevoGasto(gasto)

            // Insertar en el HTML
            ui.imprimirAlerta('Correcto', 'correcto');

            // Pasa los gastos para que se impriman...
            const { gastos, restante} = presupuesto;


            ui.mostarGastos(gastos);

            ui.actualizarRestante(restante)


            ui.comprobarPresupuesto(presupuesto)


            formulario.reset();
     }
}

function eliminarGasto(id) {
    //los elimina delm objeto
    presupuesto.eliminarGasto(id);

    //los elimina de html
    const {gastos, restante} = presupuesto;
    ui.mostarGastos(gastos)


    ui.actualizarRestante(restante)


    ui.comprobarPresupuesto(presupuesto)
}