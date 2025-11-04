// Sustituye aquí con tu URL CSV de Google Sheets:
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSQTJTebEBVZfUWQOjLVwvVXPLQBx5zgPlnwURl_GrjJpuX1VfVTD4OzkE2gg32IQHfHpEJbaS-ppG4/pub?gid=0&single=true&output=csv";

async function cargarDatos() {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();

    // ✅ Acepta CSV con coma o punto y coma como separador
    const rows = text.split("\n").map(r => r.split(/,|;/));
    const headers = rows.shift().map(h => h.trim());

    const data = rows.map(row => {
      const obj = {};
      headers.forEach((h, i) => obj[h] = row[i]?.trim());
      return obj;
    });

    prepararFiltros(data);
    mostrarDatos(data);
  } catch (err) {
    console.error("Error al cargar los datos:", err);
  }
}

function mostrarDatos(data) {
  const container = document.getElementById("content");
  const search = document.getElementById("search").value.toLowerCase();

  container.innerHTML = "";

  const filtrados = data.filter(d =>
    (d.Título?.toLowerCase().includes(search) ||
     d.Descripción?.toLowerCase().includes(search))
  );

  filtrados.forEach(d => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${d.Título}</h3>
      <p><strong>Categoría:</strong> ${d.Categoría}</p>
      <p>${d.Descripción}</p>
      ${d.Enlace ? `<a href="${d.Enlace}" target="_blank">Ver más</a>` : ""}
    `;
    container.appendChild(card);
  });
}

function prepararFiltros(data) {
  const contenedor = document.getElementById("buttons");
  contenedor.innerHTML = "";

  // ✅ Filtra valores no definidos o vacíos
  const categorias = [...new Set(data.map(d => d.Categoría).filter(Boolean))].sort();
  const todas = ["Todas", ...categorias];

  todas.forEach(cat => {
    const boton = document.createElement("button");
    boton.textContent = cat;
    boton.className = "filtro-boton";
    boton.addEventListener("click", () => {
      document.querySelectorAll(".filtro-boton").forEach(b => b.classList.remove("activo"));
      boton.classList.add("activo");
      mostrarDatos(
        cat === "Todas" ? data : data.filter(d => d.Categoría === cat)
      );
    });
    contenedor.appendChild(boton);
  });
}

cargarDatos();



