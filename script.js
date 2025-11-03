let aves = [];
let preguntasPosibles = [
  { prop: "esPequeno", valor: true, texto: "¿Es pequeño?" },       
  { prop: "esMarron", valor: true, texto: "¿Es marrón?" },          
  { prop: "esNegro", valor: true, texto: "¿Es negro?" },            
  { prop: "tieneColoresLlamativos", valor: true, texto: "¿Tiene colores llamativos?" }, 
  { prop: "canto", valor: true, texto: "¿Canta?" },                  
  { prop: "migratoria", valor: true, texto: "¿Es migratoria?" },     
  { prop: "comeGranos", valor: true, texto: "¿Come granos?" },      
  { prop: "comeInsectos", valor: true, texto: "¿Come insectos?" },  
  { prop: "pico", valor: true, texto: "¿Tiene el pico fino?" },             
  { prop: "vuelo", valor: true, texto: "¿Vuela rápido?" },
  { prop: "bandadas", valor: true, texto: "¿Suele ir en bandadas?" }    
];


let jugadorSeleccionado = null;
let maquinaSeleccionado = null;
let tableroJugador = [];
let tableroMaquina = [];
let avesEliminadasJugador = [];
let avesEliminadasMaquina = [];
let turnoJugador = true;
let preguntaEnCurso = null;
let preguntasMaquinaHechas = []; // 🔹 historial de preguntas de la máquina

// Elementos del DOM
const tableroEleccion = document.getElementById("tablero-eleccion");
const confirmarEleccionBtn = document.getElementById("confirmar-eleccion");
const tableroJugadorDiv = document.getElementById("tablero-jugador");
const tableroMaquinaDiv = document.getElementById("tablero-maquina");
const preguntaJugadorDiv = document.getElementById("pregunta-jugador");
const respuestaMaquinaP = document.getElementById("respuesta-maquina");
const preguntaMaquinaDiv = document.getElementById("pregunta-maquina");
const preguntaMaquinaTexto = document.getElementById("pregunta-maquina-texto");
const btnSi = document.getElementById("btn-si");
const btnNo = document.getElementById("btn-no");
const turnoActualSpan = document.getElementById("turno-actual");
const resultadoDiv = document.getElementById("resultado");
const reiniciarBtn = document.getElementById("reiniciar");
const botonesPreguntasDiv = document.getElementById("botones-preguntas");
const pantallaBienvenida = document.getElementById("pantalla-bienvenida");
const btnJugar = document.getElementById("btn-jugar");
const seleccionJugadorSection = document.getElementById("seleccion-jugador");
const mainContainer = document.getElementById("main-container");
const juegoSection = document.getElementById("juego");
const btnIzquierda = document.getElementById("btn-izquierda");
const btnDerecha = document.getElementById("btn-derecha");
const contenedorPreguntas = document.getElementById("botones-preguntas");


// Cargar aves desde JSON
fetch("aves.json")
  .then(res => res.json())
  .then(data => {
    aves = data;
    tableroJugador = [...aves];
    tableroMaquina = [...aves];
    cargarEleccion();
    crearBotonesPreguntas();
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


// Cuando se hace clic en "Jugar", se muestra la selección de ave
btnJugar.addEventListener("click", () => {
  pantallaBienvenida.style.display = "none";   // Oculta la pantalla inicial
  mainContainer.style.display = "block";       // Muestra el contenedor principal
  seleccionJugadorSection.style.display = "block";  // Muestra la selección del ave
  juegoSection.style.display = "none";         // Oculta el tablero hasta elegir el ave

});

function crearBotonesPreguntas() {
  botonesPreguntasDiv.innerHTML = "";
  preguntasPosibles.forEach(p => {
    const btn = document.createElement("button");
    btn.textContent = p.texto;
    btn.dataset.prop = p.prop;
    btn.dataset.valor = p.valor;
    botonesPreguntasDiv.appendChild(btn);
  });
}

function actualizarTableros() {
  if (tableroJugadorDiv.children.length === 0) {
    crearTarjetas(aves, tableroJugadorDiv, () => {}, false);
  }
  if (tableroMaquinaDiv.children.length === 0) {
    crearTarjetas(aves, tableroMaquinaDiv, () => {}, false);
  }
  marcarEliminados(tableroJugadorDiv, avesEliminadasJugador);
  marcarEliminados(tableroMaquinaDiv, avesEliminadasMaquina);
}

