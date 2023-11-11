let cantidadCartasDestapadas  = 0;
let temporizadorActivo  = false;
let paresEncontrados  = 0;
let tiempoInicial  = 60;
let tiempoRestante  = 60;
let puntajeActual  = 0;
let movimientosRealizados  = 0;
let numeros = [];

let mostrarTiempoRestante  = document.getElementById("restante");
let mostrarPuntajeActual  = document.getElementById("puntaje");
let mostrarMovimientosRealizados  = document.getElementById("movimientos");
let contenedorCartas  = document.getElementById("contenedor");
let botonReiniciar  = document.getElementById("reiniciar-btn");
let nivelActual = 'facil';
let intervaloTiempoRegresivo;


// Agrega eventos de clic a los botones
let botonesCartas  = document.querySelectorAll(".custom-btn");
botonesCartas .forEach((boton, i) => {
  boton.addEventListener("click", function () {
    girarCarta(i);
  });
});

botonReiniciar .addEventListener("click", reiniciarJuego);

// Función para contar el tiempo regresivo
function contarTiempo() {
  intervaloTiempoRegresivo = setInterval(() => {
    mostrarTiempoRestante .innerHTML = `Tiempo restante: ${tiempoRestante } segundos`;
    tiempoRestante --;
    if (tiempoRestante  < 0) {
      // Detener el temporizador cuando se agota el tiempo
      clearInterval(intervaloTiempoRegresivo);
      bloquearTarjetas(numeros);
      mostrarTiempoRestante .innerHTML = "¡Se agotó el tiempo!";
      botonReiniciar .classList.remove("d-none");
    }
  }, 1000);
}

// Función para bloquear las tarjetas y mostrar las imágenes
function bloquearTarjetas(numeros) {
  let botones = document.querySelectorAll(".custom-btn");
  botones.forEach((button, i) => {
    button.innerHTML = `<img src="./image/${numeros[i]}.png" alt="" class="carta-img">`;
    button.disabled = true;
  });
}

function girarCarta(id) {
  if (temporizadorActivo  == false) {
    contarTiempo();
    temporizadorActivo  = true;
  }

  const card = document.getElementById(id);

  if (!card.classList.contains("flipped")) {
    // Si la clase 'flipped' no está presente, voltear la carta
    card.classList.add("flipped");

    setTimeout(() => {

      if (cantidadCartasDestapadas  == 0) {
        primeraEleccion = numeros[id];
        card.innerHTML = `<img src="./image/${primeraEleccion}.png" alt="" class="carta-img">`;

        // Deshabilitar botón
        card.disabled = true;
        cantidadCartasDestapadas ++;

        primerId = id; // Almacena temporalmente la identificación de la primera carta destapada
      } else if (cantidadCartasDestapadas  == 1) {
        segundaEleccion = numeros[id];
        card.innerHTML = `<img src="./image/${segundaEleccion}.png" alt="" class="carta-img">`;
        // Deshabilitar botón
        card.disabled = true;
        cantidadCartasDestapadas ++;

        segundoId = id; // Almacena temporalmente la identificación de la segunda carta destapada

        movimientosRealizados ++;
        mostrarMovimientosRealizados .innerHTML = `Movimientos: ${movimientosRealizados }`;

        if (primeraEleccion == segundaEleccion) {
          cantidadCartasDestapadas  = 0;
          paresEncontrados ++;
          puntajeActual ++;
          mostrarPuntajeActual .innerHTML = `Puntaje: ${puntajeActual }`;
        } else {
          setTimeout(() => {
            // Recupera las identificaciones almacenadas para revertir la animación
            let card1 = document.getElementById(primerId);
            let card2 = document.getElementById(segundoId);
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.innerHTML = `<span class="interrogation">?</span>`;
            card2.innerHTML = `<span class="interrogation">?</span>`;
            card1.disabled = false;
            card2.disabled = false;
            cantidadCartasDestapadas  = 0;
          }, 500);
        }
      }

      if (paresEncontrados  == niveles[nivelActual].pares) {
        clearInterval(intervaloTiempoRegresivo);
        mostrarTiempoRestante .innerHTML = `¡Wooo! 🚀 Lograste completar el desafío en tan solo ${
          tiempoInicial  - tiempoRestante  - 1
        } segundos.`;
        mostrarPuntajeActual .innerHTML = `¡Increíble! 🌟 Tu puntaje es ${puntajeActual } 🎉.`;
        mostrarMovimientosRealizados .innerHTML = `¡Muy astuto! 🤓 Realizaste ${movimientosRealizados } movimientos estratégicos.`;
        botonReiniciar .classList.remove("d-none");
      }
    }, 100);
  }
}

function reiniciarJuego() {
  clearInterval(intervaloTiempoRegresivo);
  //Reinicia variables
  cantidadCartasDestapadas  = 0;
  temporizadorActivo  = false;
  paresEncontrados  = 0;
  tiempoRestante  = tiempoInicial ;
  puntajeActual  = 0;
  movimientosRealizados  = 0;
  mostrarTiempoRestante .innerHTML = `Tiempo restante: ${tiempoRestante } segundos`;
  mostrarPuntajeActual .innerHTML = `Puntaje: ${puntajeActual }`;
  mostrarMovimientosRealizados .innerHTML = `Movimientos: ${movimientosRealizados }`;

  // Baraja nuevamente los números
  numeros = numeros.sort(() => Math.random() - 0.5);

  // Habilita los botones y restaura su contenido
  botonesCartas .forEach((button, i) => {
    button.classList.remove("flipped");
    button.innerHTML = `<span class="interrogation">?</span>`;
    button.disabled = false;
  });
  botonReiniciar .classList.add("d-none");
}

let niveles = {
  facil: { pares: 8, tiempo: 60 },
  medio: { pares: 10, tiempo: 75 },
  dificil: { pares: 12, tiempo: 90 }
};

let nivelBtns = document.getElementById("nivel-btns");
nivelBtns.addEventListener("click", function (event) {
  if (event.target.classList.contains("nivel-btn")) {
    let nivel = event.target.id;
    iniciarJuego(nivel);
  }
});

function iniciarJuego(nivel) {
  reiniciarJuego();
  nivelActual = nivel;
  puntajeActual  = 0;
  paresEncontrados  = 0;
  movimientosRealizados  = 0;
  temporizadorActivo  = false;
  let configuracion = niveles[nivel];

  // Genera los números para el nivel seleccionado
  numeros = [];
  for (let i = 1; i <= configuracion.pares; i++) {
    numeros.push(i, i);
  }
  numeros = numeros.sort(() => Math.random() - 0.5);

  tiempoInicial  = configuracion.tiempo;
  tiempoRestante  = tiempoInicial ;

  let contenedor = document.getElementById("contenedor");
  contenedor.innerHTML = '';
  contenedor.className = 'grid ' + nivel;
  for (let i = 0; i < numeros.length; i++) {

    let boton = document.createElement("button");
    boton.id = i;
    boton.className = "custom-btn";
    boton.innerHTML = `<span class="interrogation">?</span>`;
    boton.addEventListener("click", function () {
      girarCarta(i);
    });
    contenedor.appendChild(boton);
  }
  botonesCartas  = document.querySelectorAll(".custom-btn"); // Actualizamos la lista de botones
}
