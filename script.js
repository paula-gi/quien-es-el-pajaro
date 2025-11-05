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
let preguntasMaquinaHechas = []; 

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
  pantallaBienvenida.style.display = "none";   
  mainContainer.style.display = "block";       
  seleccionJugadorSection.style.display = "block";  
  juegoSection.style.display = "none";         
  document.body.classList.remove("no-scroll");
});

btnIzquierda.addEventListener("click", () => {
  contenedorPreguntas.scrollBy({ left: -150, behavior: "smooth" });
});

btnDerecha.addEventListener("click", () => {
  contenedorPreguntas.scrollBy({ left: 150, behavior: "smooth" });
});

document.body.classList.add("no-scroll");

// 
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

function filtrarTableroPorRespuesta(tablero, prop, valor, esRespuestaSi) {
  return tablero.filter(ave => {
    if (typeof ave[prop] === "boolean") {
      return esRespuestaSi ? ave[prop] === valor : ave[prop] !== valor;
    } else {
      return esRespuestaSi ? ave[prop] === valor : ave[prop] !== valor;
    }
  });
}

function jugadorHacePregunta(prop, valor) {
  if (!turnoJugador) return;

  const aveMaquina = aves[maquinaSeleccionado];
  const valorReal = aveMaquina[prop];
  const esVerdadero =
    typeof valorReal === "boolean"
      ? valorReal === (valor === "true" || valor === true)
      : valorReal === valor;

  respuestaMaquinaP.textContent = esVerdadero ? "Sí" : "No";
  respuestaMaquinaP.classList.remove("respuesta-si", "respuesta-no");
  respuestaMaquinaP.classList.add(esVerdadero ? "respuesta-si" : "respuesta-no");

  aves
    .filter(ave => !avesEliminadasJugador.includes(ave.nombre))
    .forEach(ave => {
      const coincide = ave[prop] === valor;
      const eliminar = esVerdadero ? !coincide : coincide;
      if (eliminar) {
        avesEliminadasJugador.push(ave.nombre);
      }
    });

  actualizarTableros();
  comprobarGanador();

  turnoJugador = false;
  turnoActualSpan.textContent = "Máquina";
  preguntaJugadorDiv.style.display = "none";

  setTimeout(() => {
    respuestaMaquinaP.textContent = "";
    respuestaMaquinaP.classList.remove("respuesta-si", "respuesta-no");
    preguntaMaquinaDiv.style.display = "block";
    maquinaPregunta();
  }, 1000);
}

// Función de la máquina evitando repetir preguntas
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

btnSi.addEventListener("click", () => responderMaquina(true));
btnNo.addEventListener("click", () => responderMaquina(false));

function responderMaquina(respuestaJugador) {
  const aveJugador = aves[jugadorSeleccionado];
  const valorReal = aveJugador[preguntaEnCurso.prop];

  // Determinar si la respuesta es correcta
  let respuestaCorrecta;
  if (typeof valorReal === "boolean") {
    respuestaCorrecta = valorReal === preguntaEnCurso.valor;
  } else {
    respuestaCorrecta = valorReal === preguntaEnCurso.valor;
  }

  // Verificar si el jugador mintió
const esMentira = (respuestaJugador !== respuestaCorrecta);

if (esMentira) {
  // Mostrar mensaje de error y no dejar continuar
  mostrarMensajeMentira();
  return; 
}


  aves
    .filter(ave => !avesEliminadasMaquina.includes(ave.nombre))
    .forEach(ave => {
      const coincide = ave[preguntaEnCurso.prop] === preguntaEnCurso.valor;
      const eliminar = respuestaJugador ? !coincide : coincide;
      if (eliminar) {
        avesEliminadasMaquina.push(ave.nombre);
      }
    });

  actualizarTableros();
  comprobarGanador();

  turnoJugador = true;
  turnoActualSpan.textContent = "Jugador";
  preguntaJugadorDiv.style.display = "block";
  preguntaMaquinaDiv.style.display = "none";
  respuestaMaquinaP.textContent = "";
}

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

function mostrarMensajeGanador(mensaje) {
  resultadoDiv.textContent = mensaje;
  // mostrar el elemento (igual que antes)
  resultadoDiv.style.display = "block";
  // añade la clase que contiene los estilos
  resultadoDiv.classList.add("mensaje-ganador");
}

function finalizarJuego() {
  preguntaJugadorDiv.style.display = "none";
  preguntaMaquinaDiv.style.display = "none";
  reiniciarBtn.style.display = "inline-block";

  const botones = botonesPreguntasDiv.querySelectorAll("button");
  botones.forEach(btn => btn.disabled = true);

  confirmarEleccionBtn.disabled = true;
}

reiniciarBtn.addEventListener("click", () => {
  tableroJugador = [...aves];
  tableroMaquina = [...aves];
  avesEliminadasJugador = [];
  avesEliminadasMaquina = [];
  jugadorSeleccionado = null;
  maquinaSeleccionado = null;
  turnoJugador = true;
  preguntaEnCurso = null;
  preguntasMaquinaHechas = []; 

   // Ocultamos y limpiamos el resultado
  resultadoDiv.textContent = "";
  resultadoDiv.style.display = "none";

  reiniciarBtn.style.display = "none";

  // Volvemos a la pantalla de selección
  seleccionJugadorSection.style.display = "block";
  juegoSection.style.display = "none";

  // Cargar tarjetas de nuevo y mantener botón desactivado hasta elegir
  cargarEleccion();
  crearBotonesPreguntas();
  confirmarEleccionBtn.disabled = true;
});

function mostrarMensajeMentira() {
  const div = document.getElementById("mensaje-mentira");
  div.style.display = "block";

  // Ocultar después de 2 segundos
  setTimeout(() => {
    div.style.display = "none";
  }, 2000);
}


function finalizarPartida() {
    // Mostrar mensaje de ganador
    document.getElementById('mensaje-ganador').style.display = 'block';
    
    // Desactivar preguntas 
    document.getElementById('preguntas-arriba-container').classList.add('partida-finalizada');
}