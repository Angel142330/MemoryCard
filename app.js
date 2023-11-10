let cartasDestapadas = 0;
let temporizador = false;
let pares = 0;
let timerInicial = 20;
let timer = 20;
let puntaje = 0;
let movimientos = 0;
let mostrarTiempo = document.getElementById("restante");
let mostrarPuntaje = document.getElementById("puntaje");
let mostrarMovimientos = document.getElementById("movimientos");
let contenedor = document.getElementById("contenedor");

// Baraja y asigna números a las cartas
let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
numeros = numeros.sort(function () {
  return Math.random() - 0.3;
});

// Agrega eventos de clic a los botones
let botones = document.querySelectorAll(".custom-btn");
botones.forEach((button, i) => {
  button.addEventListener("click", function () {
    girar(i);
  });
});

// Función para contar el tiempo regresivo
function contarTiempo() {
  tiempoRegresivo = setInterval(() => {
    mostrarTiempo.innerHTML = `Tiempo restante: ${timer} segundos`;
    timer--;
    if (timer < 0) {
      // Detener el temporizador cuando se agota el tiempo
      clearInterval(tiempoRegresivo);
      bloquearTarjetas(numeros);
      mostrarTiempo.innerHTML = "¡Se agotó el tiempo!";
      // Muestra el botón de reinicio
      reiniciarBtn.style.display = "block";
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

function girar(id) {
  if (temporizador == false) {
    contarTiempo();
    temporizador = true;
  }

  const card = document.getElementById(id);

  if (!card.classList.contains("flipped")) {
    // Si la clase 'flipped' no está presente, voltear la carta
    card.classList.add("flipped");

    setTimeout(() => {
      card.classList.add("flipped");

      if (cartasDestapadas == 0) {
        primeraEleccion = numeros[id];
        card.innerHTML = `<img src="./image/${primeraEleccion}.png" alt="" class="carta-img">`;

        // Deshabilitar botón
        card.disabled = true;
        cartasDestapadas++;

        primerId = id; // Almacena temporalmente la identificación de la primera carta destapada
      } else if (cartasDestapadas == 1) {
        segundaEleccion = numeros[id];
        card.innerHTML = `<img src="./image/${segundaEleccion}.png" alt="" class="carta-img">`;
        // Deshabilitar botón
        card.disabled = true;
        cartasDestapadas++;

        segundoId = id; // Almacena temporalmente la identificación de la segunda carta destapada

        movimientos++;
        mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;

        if (primeraEleccion == segundaEleccion) {
          cartasDestapadas = 0;
          pares++;
          puntaje++;
          mostrarPuntaje.innerHTML = `Puntaje: ${puntaje}`;
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
            cartasDestapadas = 0;
          }, 500);
        }
      }

      if (pares == 8) {
        clearInterval(tiempoRegresivo);
        mostrarTiempo.innerHTML = `¡Wooo! 🚀 Lograste completar el desafío en tan solo ${
          timerInicial - timer - 1
        } segundos.`;
        mostrarPuntaje.innerHTML = `¡Increíble! 🌟 Tu puntaje es ${puntaje} 🎉.`;
        mostrarMovimientos.innerHTML = `¡Muy astuto! 🤓 Realizaste ${movimientos} movimientos estratégicos.`;
        reiniciarBtn.style.display = "block"; // Muestra el botón de reinicio
      }
    }, 100); // Tiempo de espera para voltear la carta
  }
}

let reiniciarBtn = document.getElementById("reiniciar-btn");
reiniciarBtn.addEventListener("click", reiniciarJuego);

function reiniciarJuego() {
  // Oculta el botón de reinicio
  reiniciarBtn.style.display = "none";

  // Reinicia variables
  cartasDestapadas = 0;
  temporizador = false;
  pares = 0;
  timer = timerInicial;
  puntaje = 0;
  movimientos = 0;
  mostrarTiempo.innerHTML = `Tiempo restante: ${timer} segundos`;
  mostrarPuntaje.innerHTML = `Puntaje: ${puntaje}`;
  mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;

  // Baraja nuevamente los números
  numeros = numeros.sort(() => Math.random() - 0.5);

  // Habilita los botones y restaura su contenido
  botones.forEach((button, i) => {
    button.classList.remove("flipped");
    button.innerHTML = `<span class="interrogation">?</span>`;
    button.disabled = false;
  });

}


