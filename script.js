let aves = [];

let jugadorSeleccionado = null;
let maquinaSeleccionado = null;
let tableroJugador = [];
let tableroMaquina = [];

const tableroEleccion = document.getElementById("tablero-eleccion");
const confirmarEleccionBtn = document.getElementById("confirmar-eleccion");
const seleccionJugadorSection = document.getElementById("seleccion-jugador");
const juegoSection = document.getElementById("juego");
const tableroJugadorDiv = document.getElementById("tablero-jugador");
const tableroMaquinaDiv = document.getElementById("tablero-maquina");
const resultadoDiv = document.getElementById("resultado");
const aveJugadorElegidaDiv = document.getElementById("ave-jugador-elegida");


// Cargar aves desde JSON
fetch("aves.json")
  .then(res => res.json())
  .then(data => {
    aves = data;
    cargarEleccion();
  })
  .catch(err => console.error("Error al cargar aves.json:", err));

function crearTarjetas(array, contenedor, clickHandler, permitirSeleccion = true) {
  contenedor.innerHTML = "";
  array.forEach((ave, index) => {
    const div = document.createElement("div");
    div.classList.add("personaje");
    div.innerHTML = `
      <img src="${ave.imagen}" alt="${ave.nombre}" />
      <div class="nombre-ave">${ave.nombre}</div>
    `;
    if (permitirSeleccion) {
      div.addEventListener("click", () => clickHandler(index));
    }
    contenedor.appendChild(div);
  });
}

function seleccionarJugador(index) {
  if (jugadorSeleccionado !== null) {
    tableroEleccion.children[jugadorSeleccionado].classList.remove("seleccionado");
  }
  jugadorSeleccionado = index;
  tableroEleccion.children[index].classList.add("seleccionado");
  confirmarEleccionBtn.disabled = false;
}

function seleccionarMaquina() {
  const index = Math.floor(Math.random() * aves.length);
  maquinaSeleccionado = index;
}

function iniciarJuego() {
  if (jugadorSeleccionado === null) {
    alert("Selecciona un ave secreta primero.");
    return;
  }

  seleccionarMaquina();
  seleccionJugadorSection.style.display = "none";
  juegoSection.style.display = "block";
  turnoJugador = true;
  respuestaMaquinaP.textContent = "";
  preguntaMaquinaDiv.style.display = "none";
  resultadoDiv.textContent = "";
  turnoActualSpan.textContent = "Jugador";

  mostrarAveJugadorElegida();
  actualizarTableros();
}

function mostrarAveJugadorElegida() {
  const ave = aves[jugadorSeleccionado];
  const contenedor = document.getElementById("ave-jugador-elegida");
  contenedor.innerHTML = `
    <h4>Tu ave secreta:</h4>
    <div class="personaje seleccionado">
      <img src="${ave.imagen}" alt="${ave.nombre}" />
      <div class="nombre-ave">${ave.nombre}</div>
    </div>
  `;
}

function cargarEleccion() {
  crearTarjetas(aves, tableroEleccion, seleccionarJugador);
}

confirmarEleccionBtn.addEventListener("click", iniciarJuego);

// --- Pantalla de bienvenida ---
const pantallaBienvenida = document.getElementById("pantalla-bienvenida");
const mainContainer = document.getElementById("main-container");
const btnJugar = document.getElementById("btn-jugar");

// Cuando se hace clic en "Jugar", se muestra la selección de ave
btnJugar.addEventListener("click", () => {
  pantallaBienvenida.style.display = "none";   // Oculta la pantalla inicial
  mainContainer.style.display = "block";       // Muestra el contenedor principal
  seleccionJugadorSection.style.display = "block";  // Muestra la selección del ave
  juegoSection.style.display = "none";         // Oculta el tablero hasta elegir el ave
});
