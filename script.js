let aves = [];
// Lista de preguntas que el jugador o la máquina pueden hacer
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

// Variables del juego
let jugadorSeleccionado = null;
let maquinaSeleccionado = null;
let tableroJugador = [];
let tableroMaquina = [];
let avesEliminadasJugador = [];
let avesEliminadasMaquina = [];
let turnoJugador = true;
let preguntaEnCurso = null;
let preguntasMaquinaHechas = [];
let juegoTerminado = false; 

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

// Crea tarjetas visuales para cada ave  
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

// Crea los botones de preguntas para el jugador
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

// El jugador selecciona su ave secreta
function seleccionarJugador(index) {
  if (jugadorSeleccionado !== null) {
    tableroEleccion.children[jugadorSeleccionado].classList.remove("seleccionado");
  }
  jugadorSeleccionado = index;
  tableroEleccion.children[index].classList.add("seleccionado");
  confirmarEleccionBtn.disabled = false;
}

// La máquina elige un ave al azar
function seleccionarMaquina() {
  const index = Math.floor(Math.random() * aves.length);
  maquinaSeleccionado = index;
}

// Inicia el juego
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

// Muestra el ave elegida por el jugador
function mostrarAveJugadorElegida() {
  const ave = aves[jugadorSeleccionado];
  const contenedor = document.getElementById("ave-jugador-elegida");
  contenedor.innerHTML = `
    <h3 class="titulo-tablero">Tu ave secreta</h3>
    <div class="personaje seleccionado">
      <img src="${ave.imagen}" alt="${ave.nombre}" />
      <div class="nombre-ave">${ave.nombre}</div>
    </div>
  `;
}

// Carga la pantalla de elección de aves
function cargarEleccion() {
  crearTarjetas(aves, tableroEleccion, seleccionarJugador);
}

// Eventos de botones
confirmarEleccionBtn.addEventListener("click", iniciarJuego);
btnJugar.addEventListener("click", () => {
  pantallaBienvenida.style.display = "none";
  mainContainer.style.display = "block";
  seleccionJugadorSection.style.display = "block";
  juegoSection.style.display = "none";
  document.body.classList.remove("no-scroll");
});

// Botones para mover la lista de preguntas
btnIzquierda.addEventListener("click", () => {
  contenedorPreguntas.scrollBy({ left: -150, behavior: "smooth" });
});

btnDerecha.addEventListener("click", () => {
  contenedorPreguntas.scrollBy({ left: 150, behavior: "smooth" });
});

document.body.classList.add("no-scroll");

// El jugador hace una pregunta
botonesPreguntasDiv.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON" && turnoJugador && !e.target.disabled) {
    const prop = e.target.dataset.prop;
    let valor = e.target.dataset.valor;
    if (valor === "true") valor = true;
    if (valor === "false") valor = false;

    e.target.disabled = true;
    e.target.classList.add("usada");

    jugadorHacePregunta(prop, valor);
  }
});

// Actualiza las tarjetas mostrando cuáles aves han sido eliminadas
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

// Marca las aves eliminadas visualmente
function marcarEliminados(contenedor, listaEliminados) {
  for (let i = 0; i < contenedor.children.length; i++) {
    const card = contenedor.children[i];
    const nombreAve = card.querySelector(".nombre-ave").textContent.trim();
    if (listaEliminados.includes(nombreAve)) {
      card.classList.add("eliminado");
    } else {
      card.classList.remove("eliminado");
    }
  }
}

// Procesa la pregunta del jugador y muestra la respuesta
function jugadorHacePregunta(prop, valor) {
  if (!turnoJugador || juegoTerminado) return;

  const aveMaquina = aves[maquinaSeleccionado];
  const valorReal = aveMaquina[prop];
  const esVerdadero =
    typeof valorReal === "boolean"
      ? valorReal === (valor === "true" || valor === true)
      : valorReal === valor;

  respuestaMaquinaP.textContent = esVerdadero ? "Sí" : "No";
  respuestaMaquinaP.classList.remove("respuesta-si", "respuesta-no");
  respuestaMaquinaP.classList.add(esVerdadero ? "respuesta-si" : "respuesta-no");

  // Elimina las aves que no coinciden con la respuesta
  aves
    .filter(ave => !avesEliminadasJugador.includes(ave.nombre))
    .forEach(ave => {
      const coincide = ave[prop] === valor;
      const eliminar = esVerdadero ? !coincide : coincide;
      if (eliminar) avesEliminadasJugador.push(ave.nombre);
    });

  actualizarTableros();
  comprobarGanador();

   // Turno de la máquina
  turnoJugador = false;
  turnoActualSpan.textContent = "Máquina";
  preguntaJugadorDiv.style.display = "none";

  setTimeout(() => {
    if (juegoTerminado) return; // ✅ Evita la pregunta extra

    respuestaMaquinaP.textContent = "";
    respuestaMaquinaP.classList.remove("respuesta-si", "respuesta-no");
    preguntaMaquinaDiv.style.display = "block";
    maquinaPregunta();
  }, 1000);
}

// La máquina hace una pregunta aleatoria
function maquinaPregunta() {
  const disponibles = preguntasPosibles.filter(p => !preguntasMaquinaHechas.includes(p.prop));

  if (disponibles.length === 0) {
    preguntaMaquinaTexto.textContent = "La máquina no tiene más preguntas.";
    btnSi.disabled = true;
    btnNo.disabled = true;
    return;
  }

  const pregunta = disponibles[Math.floor(Math.random() * disponibles.length)];
  preguntaEnCurso = { prop: pregunta.prop, valor: pregunta.valor };
  preguntaMaquinaTexto.textContent = pregunta.texto;
  preguntasMaquinaHechas.push(pregunta.prop);  
  btnSi.disabled = false;
  btnNo.disabled = false;
}

// El jugador responde a la pregunta de la máquina
btnSi.addEventListener("click", () => responderMaquina(true));
btnNo.addEventListener("click", () => responderMaquina(false));

// Procesa la respuesta del jugador a la máquina
function responderMaquina(respuestaJugador) {
  if (juegoTerminado) return;

  const aveJugador = aves[jugadorSeleccionado];
  const valorReal = aveJugador[preguntaEnCurso.prop];
  let respuestaCorrecta = valorReal === preguntaEnCurso.valor;

  // Si el jugador miente, se muestra un aviso
  const esMentira = (respuestaJugador !== respuestaCorrecta);
  if (esMentira) {
    mostrarMensajeMentira();
    return;
  }

  // Elimina aves de la máquina según la respuesta
  aves
    .filter(ave => !avesEliminadasMaquina.includes(ave.nombre))
    .forEach(ave => {
      const coincide = ave[preguntaEnCurso.prop] === preguntaEnCurso.valor;
      const eliminar = respuestaJugador ? !coincide : coincide;
      if (eliminar) avesEliminadasMaquina.push(ave.nombre);
    });

  actualizarTableros();
  comprobarGanador();

  // Cambia el turno al jugador
  turnoJugador = true;
  turnoActualSpan.textContent = "Jugador";
  preguntaJugadorDiv.style.display = "block";
  preguntaMaquinaDiv.style.display = "none";
  respuestaMaquinaP.textContent = "";
}

// Comprueba si alguien ha ganado
function comprobarGanador() {
  const avesRestantesJugador = tableroJugador.filter(ave => !avesEliminadasJugador.includes(ave.nombre));
  const avesRestantesMaquina = tableroMaquina.filter(ave => !avesEliminadasMaquina.includes(ave.nombre));

  if (avesRestantesJugador.length === 1) {
    mostrarMensajeGanador("¡Felicidades! Has adivinado el ave de la máquina: " + avesRestantesJugador[0].nombre);
    finalizarJuego();
  } else if (avesRestantesMaquina.length === 1) {
    mostrarMensajeGanador("La máquina ha adivinado tu ave: " + avesRestantesMaquina[0].nombre);
    finalizarJuego();
  }
}

// Muestra el mensaje final de victoria
function mostrarMensajeGanador(mensaje) {
  resultadoDiv.textContent = mensaje;
  resultadoDiv.style.display = "block";
  resultadoDiv.classList.add("mensaje-ganador");
}

// Finaliza el juego y desactiva botones
function finalizarJuego() {
  juegoTerminado = true;
  preguntaJugadorDiv.style.display = "none";
  preguntaMaquinaDiv.style.display = "none";
  reiniciarBtn.style.display = "inline-block";

  const botones = botonesPreguntasDiv.querySelectorAll("button");
  botones.forEach(btn => btn.disabled = true);
  confirmarEleccionBtn.disabled = true;
}

// Reinicia el juego desde el inicio
reiniciarBtn.addEventListener("click", () => {
  juegoTerminado = false;

  tableroJugador = [...aves];
  tableroMaquina = [...aves];
  avesEliminadasJugador = [];
  avesEliminadasMaquina = [];
  jugadorSeleccionado = null;
  maquinaSeleccionado = null;
  turnoJugador = true;
  preguntaEnCurso = null;
  preguntasMaquinaHechas = [];

  resultadoDiv.textContent = "";
  resultadoDiv.style.display = "none";
  reiniciarBtn.style.display = "none";

  preguntaJugadorDiv.style.display = "block";
  preguntaMaquinaDiv.style.display = "none";

  crearBotonesPreguntas();
  const botones = botonesPreguntasDiv.querySelectorAll("button");
  botones.forEach(btn => btn.disabled = false);

  confirmarEleccionBtn.disabled = true;
  seleccionJugadorSection.style.display = "block";
  juegoSection.style.display = "none";

  cargarEleccion();
});

// Muestra mensaje si el jugador miente
function mostrarMensajeMentira() {
  const div = document.getElementById("mensaje-mentira");
  div.style.display = "block";
  setTimeout(() => {
    div.style.display = "none";
  }, 2000);
}
