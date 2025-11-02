let aves = [];

const tableroEleccion = document.getElementById("tablero-eleccion");

// Cargar aves desde JSON
fetch("aves.json")
  .then(res => res.json())
  .then(data => {
    aves = data;
    cargarEleccion();
  })
  .catch(err => console.error("Error al cargar aves.json:", err));

function crearTarjetas(array, contenedor) {
  contenedor.innerHTML = "";
  array.forEach(ave => {
    const div = document.createElement("div");
    div.classList.add("personaje");
    div.innerHTML = `
      <img src="${ave.imagen}" alt="${ave.nombre}" />
      <div class="nombre-ave">${ave.nombre}</div>
    `;
    contenedor.appendChild(div);
  });
}

function cargarEleccion() {
  crearTarjetas(aves, tableroEleccion);
}
