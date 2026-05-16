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

function initMap() {
    if (mapInitialized) {
        if (mapInstance) mapInstance.invalidateSize({ animate: false });
        return;
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer || mapContainer.clientWidth === 0 || mapContainer.clientHeight === 0) return;

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

window.zoomToLocation = (id) => {
    if (!mapInstance || !window.directoryData) return;
    const item = window.directoryData.find(d => d.id === id);
    if (!item || !item.dot) return;
    mapInstance.setView([-item.dot[1], item.dot[0]], -0.5);
};

document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view-section');
    const directoryList = document.getElementById('directory-list');
    const artistGrid = document.getElementById('artist-grid');
    const attractionsGrid = document.getElementById('attractions-grid');
    const festivalsGrid = document.getElementById('festivals-grid');
    const regionTags = document.querySelectorAll('#region-filters .tag');
    const categoryTags = document.querySelectorAll('#category-filters .tag');

    renderDirectory();
    renderGrids();

    window.switchView = (targetId) => {
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
            initMap();
            setTimeout(() => initMap(), 50);
            setTimeout(() => {
                if (mapInstance) {
                    mapInstance.invalidateSize({ animate: false });
                    mapInstance.setView([-MAP_H / 2, MAP_W / 2], -2);
                }
            }, 150);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            window.switchView(btn.getAttribute('data-target'));
        });
    });

    regionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            regionTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderDirectory();
        });
    });

    categoryTags.forEach(tag => {
        tag.addEventListener('click', () => {
            categoryTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderDirectory();
        });
    });

    function getPhotoHtml(item) {
        if (item.photo) {
            return `<img src="${item.photo}" alt="${item.name}" class="card-img" onerror="this.onerror=null;this.style.display='none';this.insertAdjacentHTML('afterend','<div class=\\'card-img-placeholder\\'>${item.name.charAt(0)}</div>')">`;
        }
        return `<div class="card-img-placeholder">${item.name.charAt(0)}</div>`;
    }

    function renderDirectory() {
        if (!directoryList) return;
        directoryList.innerHTML = '';
        
        const activeRegion = document.querySelector('#region-filters .tag.active')?.getAttribute('data-region') || 'All';
        const activeCategory = document.querySelector('#category-filters .tag.active')?.getAttribute('data-category') || 'All';

        const filteredData = window.directoryData.filter(item => {
            const regionMatch = activeRegion === 'All' || item.region === activeRegion;
            const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
            return regionMatch && categoryMatch;
        });

        filteredData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'directory-card';
            card.innerHTML = `
                <div class="card-image-wrapper">${getPhotoHtml(item)}</div>
                <div class="card-info">
                    <h4>${item.name}</h4>
                    <p>${item.area}</p>
                    <span class="card-category" style="background: ${categoryColors[item.category] || '#2D6A4F'};">${item.category}</span>
                </div>
            `;
            card.addEventListener('click', () => {
                window.zoomToLocation(item.id);
            });
            directoryList.appendChild(card);
        });
    }

    function renderGrids() {
        if (!artistGrid || !attractionsGrid) return;
        artistGrid.innerHTML = '';
        attractionsGrid.innerHTML = '';
        if (festivalsGrid) festivalsGrid.innerHTML = '';

        window.directoryData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'directory-card premium-grid-card';
            card.innerHTML = `
                <div class="grid-card-visual">${getPhotoHtml(item)}</div>
                <div class="card-info">
                    <h4>${item.name}</h4>
                    <p class="grid-card-location">${item.area}</p>
                    <p class="grid-card-desc">${item.description}</p>
                </div>
            `;
            if (item.category === 'Artists') {
                artistGrid.appendChild(card);
            } else if (item.category === 'Festivals' && festivalsGrid) {
                festivalsGrid.appendChild(card);
            } else {
                attractionsGrid.appendChild(card);
            }
        });
    }
});
