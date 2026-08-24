// =========================================================
// SWITCH DE TEMA (Light / Dark)
// =========================================================
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', themeToggle.checked);
});

// =========================================================
// PANEL DE INFRAESTRUCTURA (FAB + Apertura/Cierre)
// =========================================================
const fabIE = document.getElementById('fab-ie');
const panel = document.getElementById('panel');

function togglePanel() {
  fabIE.classList.toggle('selected');
  
  // Al abrir, el panel se coloca SIEMPRE debajo del FAB y a la derecha (16px de separación)
  if (!panel.classList.contains('visible')) {
    panel.style.position = 'fixed';
    panel.style.top = '84px'; // 20px (top FAB) + 48px (alto FAB) + 16px (separación)
    panel.style.right = '225px'; // Misma alineación derecha que el FAB
    panel.style.left = 'auto';
    panel.style.bottom = 'auto';
    panel.style.margin = '0';
  }

  panel.classList.toggle('visible');
  
  // Actualizar ARIA
  const isVisible = panel.classList.contains('visible');
  fabIE.setAttribute('aria-expanded', isVisible);
}

fabIE.addEventListener('click', (e) => {
  e.stopPropagation();
  togglePanel();
});

document.getElementById('close-panel-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  panel.classList.remove('visible');
  fabIE.classList.remove('selected');
  fabIE.setAttribute('aria-expanded', 'false');
});

// =========================================================
// PERFIL DE USUARIO (Accesibilidad)
// =========================================================
const userProfile = document.getElementById('user-profile');
userProfile.addEventListener('click', () => {
  console.log("Perfil clickeado");
});
userProfile.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    userProfile.click();
  }
});

// =========================================================
// DRAG & DROP DEL PANEL (Solo con mouse)
// =========================================================
const dragHandle = document.getElementById('drag-handle');
let isDragging = false;
let startX, startY, initialLeft, initialTop;

dragHandle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const rect = panel.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;
    panel.style.left = `${initialLeft}px`;
    panel.style.top = `${initialTop}px`;
    panel.style.right = 'auto';
    panel.classList.add('dragging');
    dragHandle.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    dragHandle.setAttribute('aria-grabbed', 'true');
    e.preventDefault();
});

document.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    panel.style.left = `${initialLeft + deltaX}px`;
    panel.style.top = `${initialTop + deltaY}px`;
});

document.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;
    panel.classList.remove('dragging');
    dragHandle.style.cursor = 'grab';
    document.body.style.userSelect = '';
    dragHandle.setAttribute('aria-grabbed', 'false');
});

// Soporte de teclado para Drag Handle
dragHandle.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    console.log("Arrastrar panel (funcionalidad táctil no implementada)");
  }
});

// Cerrar con tecla Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (panel.classList.contains('visible')) {
      panel.classList.remove('visible');
      fabIE.classList.remove('selected');
      fabIE.setAttribute('aria-expanded', 'false');
    }
  }
});

// =========================================================
// GENERAR TARJETAS DEL PANEL PRINCIPAL (12 Apoyos)
// =========================================================
function crearTarjeta() {
    const card = document.createElement('div');
    card.classList.add('card');
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');
    
    card.innerHTML = `
        <div class="card-image" aria-hidden="true">
            <svg viewBox="0 0 100 150" xmlns="http://www.w3.org/2000/svg">
                <rect x="45" y="40" width="10" height="110" rx="2" fill="#FFC107"/>
                <rect x="20" y="60" width="60" height="8" rx="2" fill="#FFC107"/>
                <circle cx="25" cy="58" r="6" fill="#FFC107"/>
                <circle cx="75" cy="58" r="6" fill="#FFC107"/>
                <rect x="38" y="50" width="24" height="30" rx="2" fill="#FFC107"/>
            </svg>
        </div>
        <div class="card-label">Apoyos</div>
    `;
    
    const toggleSelection = () => {
        card.classList.toggle('selected');
        const isSelected = card.classList.contains('selected');
        card.setAttribute('aria-pressed', isSelected);
    };

    card.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSelection();
    });

    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSelection();
        }
    });

    return card;
}

const contenedor = document.getElementById('gridApoyos');
for (let i = 0; i < 12; i++) {
    contenedor.appendChild(crearTarjeta());
}

// =========================================================
// MENÚ DE CAPAS (Independiente)
// =========================================================
const capas = [
  { nombre: 'Ortofoto', img: 'Img-layer-1-ortofoto.png' },
  { nombre: 'OSM',      img: 'Img-layer-2-openstreetmap.png' },
  { nombre: 'SigCom',   img: 'Img-layer-3-sigcom-map.png' },
  { nombre: 'Más',      img: 'Img-layers-plus.png' }
];

function crearLayerTarjeta(nombre, imgSrc) {
  const card = document.createElement('div');
  card.classList.add('layer-card');
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-pressed', 'false');
  
  card.innerHTML = `
    <div class="layer-card-image" aria-hidden="true">
      <img src="${imgSrc}" alt="" />
    </div>
    <div class="layer-card-label">${nombre}</div>
  `;
  
  const toggleSelection = () => {
    card.classList.toggle('selected');
    const isSelected = card.classList.contains('selected');
    card.setAttribute('aria-pressed', isSelected);
  };

  card.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSelection();
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSelection();
    }
  });

  return card;
}

const contenedorCapas = document.getElementById('gridCapas');
capas.forEach(capa => contenedorCapas.appendChild(crearLayerTarjeta(capa.nombre, capa.img)));

// Lógica de hover y clic para mostrar/ocultar el panel de capas
const layerGroup = document.getElementById('layerGroup');
const layerPanelContainer = document.getElementById('layerPanelContainer');
const collapsedLayer = document.getElementById('collapsedLayer');
let layerTimeoutId = null;

function showLayerPanel() {
  clearTimeout(layerTimeoutId);
  layerPanelContainer.classList.add('visible');
  collapsedLayer.classList.add('selected');
  collapsedLayer.setAttribute('aria-expanded', 'true');
}

function hideLayerPanel() {
  layerTimeoutId = setTimeout(() => {
    layerPanelContainer.classList.remove('visible');
    collapsedLayer.classList.remove('selected');
    collapsedLayer.setAttribute('aria-expanded', 'false');
  }, 100);
}

layerGroup.addEventListener('mouseenter', showLayerPanel);
layerGroup.addEventListener('mouseleave', hideLayerPanel);

collapsedLayer.addEventListener('mouseenter', () => { clearTimeout(layerTimeoutId); });
layerPanelContainer.addEventListener('mouseenter', () => { clearTimeout(layerTimeoutId); });

// Accesibilidad por teclado para el botón colapsado de capas
collapsedLayer.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    // Alternar visibilidad
    if (layerPanelContainer.classList.contains('visible')) {
      hideLayerPanel();
    } else {
      showLayerPanel();
    }
  }
});