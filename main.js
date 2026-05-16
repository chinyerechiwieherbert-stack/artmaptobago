// ── 1. GLOBAL ELEMENT CONFIGURATIONS ──
const categoryColors = {
    'Artists': '#2D6A4F',
    'Museums': '#D62828',
    'Galleries': '#D62828',
    'Heritage': '#D62828',
    'Nature': '#0077B6',
    'Cultural Sites': '#E0A96D',
    'Creative Businesses': '#2D6A4F',
    'Workshops': '#2D6A4F',
    'Festivals': '#E0A96D',
    'Public Art': '#2D6A4F'
};

let mapInstance = null;
let mapInitialized = false;
const MAP_W = 5325;
const MAP_H = 3525;
const mapBounds = [[-MAP_H, 0], [0, MAP_W]];

// ── 2. MAP LIFE-CYCLE ENGINE ──
function initMap() {
    if (mapInitialized) {
        if (mapInstance) mapInstance.invalidateSize({ animate: false });
        return;
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    mapInitialized = true;

    mapInstance = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 1,
        zoomControl: false, 
        attributionControl: false,
        maxBounds: mapBounds,
        maxBoundsViscosity: 1.0
    });

    L.imageOverlay('tobago_art_map.jpg', mapBounds).addTo(mapInstance);
    mapInstance.setView([-MAP_H / 2, MAP_W / 2], -2);
    window.map = mapInstance;

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
}

// ── 3. LOCATION POSITION SNAPPING ENGINE ──
window.zoomToLocation = (id) => {
    if (!mapInstance || !window.directoryData) return;
    const item = window.directoryData.find(d => d.id === id);
    if (!item) return;

    let target = null;
    let zoomLevel = -1.2; 

    if (item.box) {
        const [bx, by, bw, bh] = item.box;
        const cx = bx + (bw / 2);
        const cy = by + (bh / 2);
        target = [-cy, cx];
    } else if (item.dot) {
        const [x, y] = item.dot;
        target = [-y, x];
    }

    if (target) {
        mapInstance.setView(target, zoomLevel);
    }

    const mapSection = document.getElementById('map-view');
    if (mapSection && !mapSection.classList.contains('hidden')) {
        const offset = 80; 
        const elementPosition = mapSection.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
};

// ── 4. BULLETPROOF TAB SWITCHER ──
// Placed globally so it never gets blocked by data loading errors
window.switchView = (targetId) => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view-section');

    navBtns.forEach(btn => {
        if (btn.getAttribute('data-target') === targetId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    views.forEach(view => {
        if (view.id === targetId) {
            view.classList.remove('hidden');
        } else {
            view.classList.add('hidden');
        }
    });

    if (targetId === 'map-view') {
        setTimeout(() => {
            initMap();
            if (mapInstance) {
                mapInstance.invalidateSize({ animate: false });
                mapInstance.setView([-MAP_H / 2, MAP_W / 2], -2);
            }
        }, 100);
        
        setTimeout(() => {
            if (mapInstance) mapInstance.invalidateSize({ animate: false });
        }, 400);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ── 5. APPLICATION DATA & EVENTS ──
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Immediately attach navigation buttons so they ALWAYS work
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.switchView(btn.getAttribute('data-target'));
        });
    });

    // 2. Safely build the data sections
    const directoryList = document.getElementById('directory-list');
    const artistGrid = document.getElementById('artist-grid');
    const attractionsGrid = document.getElementById('attractions-grid');
    const festivalsGrid = document.getElementById('festivals-grid');
    const regionTags = document.querySelectorAll('#region-filters .tag');
    const categoryTags = document.querySelectorAll('#category-filters .tag');
    const modal = document.getElementById('profile-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    let currentRegion = 'All';
    let currentCategory = 'All';

    function getPhotoHtml(item) {
        if (item.photo) {
            return `<img src="${item.photo}" alt="${item.name}" class="card-img" onerror="this.onerror=null;this.style.display='none';this.insertAdjacentHTML('afterend','<div class=\\'card-img-placeholder\\'>${item.name.charAt(0)}</div>')">`;
        }
        return `<div class="card-img-placeholder">${item.name.charAt(0)}</div>`;
    }

    function renderDirectory() {
        if (!directoryList || !window.directoryData) return;
        directoryList.innerHTML = '';
        
        const filteredData = window.directoryData.filter(item => {
            const regionMatch = currentRegion === 'All' || item.region === currentRegion;
            const categoryMatch = currentCategory === 'All' || item.category === currentCategory;
            return regionMatch && categoryMatch;
        });

        filteredData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'directory-card';
            card.setAttribute('data-id', item.id);
            card.style.animationDelay = `${index * 0.01}s`;
            card.innerHTML = `
                <div class="card-image-wrapper">${getPhotoHtml(item)}</div>
                <div class="card-info">
                    <h4>${item.name}</h4>
                    <p>${item.area}</p>
                    <span class="card-category" style="background: ${categoryColors[item.category] || '#2D6A4F'}; color: white;">${item.category}</span>
                </div>
                <div class="card-arrow">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
            `;
            
            card.addEventListener('click', () => {
                window.zoomToLocation(item.id);
                document.querySelectorAll('.directory-card').forEach(c => c.classList.remove('highlight-active'));
                card.classList.add('highlight-active');
            });

            directoryList.appendChild(card);
        });
