let cantidadCartasDestapadas  = 0;
let temporizadorActivo  = false;
let paresEncontrados  = 0;
let tiempoInicial  = 0;
let tiempoRestante  = 0;
let puntajeActual  = 0;
let movimientosRealizados  = 0;
let numeros = [];

let mostrarTiempoRestante  = document.getElementById("restante");
let mostrarPuntajeActual  = document.getElementById("puntaje");
let mostrarMovimientosRealizados  = document.getElementById("movimientos");
let contenedorCartas  = document.getElementById("contenedor");
let botonReiniciar  = document.getElementById("reiniciar-btn");
let contenedorConfeti = document.getElementById("confetti-container");
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
function iniciarConteoTiempo() {
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
    iniciarConteoTiempo();
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
            revertirGiroCartas(primerId, segundoId);
          }, 500);
        }
      }

      if (paresEncontrados === niveles[nivelActual].pares) {
        clearInterval(intervaloTiempoRegresivo);
        mostrarTiempoRestante.innerHTML = `¡Enhorabuena! Completaste el desafío en ${tiempoInicial - tiempoRestante - 1} segundos.`;
        mostrarMovimientosRealizados.innerHTML = `Realizaste ${movimientosRealizados} movimientos.`;
        botonReiniciar.classList.remove("d-none");
        celebrarVictoria();
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
   
  // Elimina los confettis
  contenedorConfeti.innerHTML = '';

}

let niveles = {
  facil: { pares: 8, tiempo: 60 },
  medio: { pares: 10, tiempo: 75 },
  dificil: { pares: 12, tiempo: 90 }
};

let botonesNivel  = document.getElementById("nivel-btns");
botonesNivel .addEventListener("click", function (event) {
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


function revertirGiroCartas(id1, id2) {
  let card1 = document.getElementById(id1);
  let card2 = document.getElementById(id2);
  card1.classList.remove("flipped");
  card2.classList.remove("flipped");
  card1.innerHTML = `<span class="interrogation">?</span>`;
  card2.innerHTML = `<span class="interrogation">?</span>`;
  card1.disabled = false;
  card2.disabled = false;
  cantidadCartasDestapadas  = 0;
}




function celebrarVictoria() {
  const colores = ["#0000FF", "#FFFF00", "#00FFFF", "#7FFF00", "#FF00FF","#4B0082","#FFF5EE"]; // Puedes agregar más colores
  
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = `${Math.random() * window.innerWidth}px`;
        confetti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        confetti.style.width = `${Math.random() * 10 + 5}px`; // Tamaños variados entre 5 y 15 px
        confetti.style.height = confetti.style.width;
        confetti.style.animationDuration = `${Math.random() * 2 + 1}s`; // Duraciones variadas entre 1 y 3 segundos
        confetti.style.animationDelay = `${Math.random()}s`; // Retrasos aleatorios
        contenedorConfeti.appendChild(confetti);
    }
}