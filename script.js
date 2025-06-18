let revendedores = [];
let map;
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("mapa"), {
    center: { lat: -14.2350, lng: -51.9253 },
    zoom: 4,
  });

  fetch('https://opensheet.elk.sh/10RLYZUNGeMJsHYfLAT8tI5tvY8SfDNxJwckjFPR-aOQ/Página1')
    .then(response => response.json())
    .then(data => {
      revendedores = data.map(r => ({
        estado: r.estado.toUpperCase(),
        nome: r.nome,
        endereco: r.endereco,
        telefone: r.telefone,
        url: r.url,
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lng)
      }));
      carregarEstados();
    })
    .catch(err => {
      console.error("Erro ao carregar os dados:", err);
    });
}

function carregarEstados() {
  const select = document.getElementById('estadoSelect');
  const estadosUnicos = [...new Set(revendedores.map(r => r.estado))];

  estadosUnicos.forEach(estado => {
    const option = document.createElement('option');
    option.value = estado;
    option.textContent = estado;
    select.appendChild(option);
  });
}

function limparMarcadores() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
}

function filtrarRevendedores() {
  const estado = document.getElementById('estadoSelect').value;
  const container = document.getElementById('listaRevendedores');
  container.innerHTML = '';

  limparMarcadores();

  const filtrados = revendedores.filter(r => r.estado === estado);

  if (filtrados.length === 0) {
    container.innerHTML = '<p>Nenhum revendedor encontrado para este estado.</p>';
    return;
  }

  map.setCenter({ lat: filtrados[0].lat, lng: filtrados[0].lng });
  map.setZoom(10);

  filtrados.forEach(r => {
    const marker = new google.maps.Marker({
      position: { lat: r.lat, lng: r.lng },
      map: map,
      title: r.nome
    });
    markers.push(marker);

    const div = document.createElement('div');
    div.classList.add('revendedor');
    div.innerHTML = `
      <div class="rev-coluna estado">${r.estado}</div>
      <div class="rev-coluna nome">${r.nome}</div>
      <div class="rev-coluna endereco">
        ${r.endereco}<br>
        TEL: ${r.telefone}<br>
        URL: <a href="${r.url}" target="_blank">${r.url}</a>
      </div>
    `;
    container.appendChild(div);
  });
}
