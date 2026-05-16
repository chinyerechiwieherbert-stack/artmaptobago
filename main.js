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

let mapInstance;
let mapInitialized = false;

// ── FIXED COORDINATE SCALAR ZOOM ENGINE ──
function initMap() {
    if (mapInitialized) return;
    
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    mapInitialized = true;
    const w = 5325;
    const h = 3525;
    const bounds = [[-h, 0], [0, w]];

    mapInstance = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 1,
        zoomControl: false,
        attributionControl: false,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0
    });

    L.imageOverlay('tobago_art_map.jpg', bounds).addTo(mapInstance);
    mapInstance.fitBounds(bounds);
    window.map = mapInstance;

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
}

// THE CULPRIT IS FIXED HERE: Explicitly assigning X and Y array mappings
window.zoomToLocation = (id) => {
    if (!mapInstance || !window.directoryData) return;
    const item = window.directoryData.find(d => d.id === id);
    if (!item) return;

    let targetX = 0;
    let targetY = 0;

    if (item.dot) {
        // Data format is [X, Y]. X is index 0 (Horizontal), Y is index 1 (Vertical)
        targetX = item.dot[0];
        targetY = item.dot[1];
    } else if (item.box) {
        targetX = item.box[0] + (item.box[2] / 2);
        targetY = item.box[1] + (item.box[3] / 2);
    } else {
        return; 
    }

    // Leaflet Simple CRS expects [-Y, X] geometry placement
    const accurateMapLatLng = [-targetY, targetX];
    
    // Zoom levels: 0 is closer, -1 is slightly further back so you can see the name context clearly
    mapInstance.flyTo(accurateMapLatLng, -1, {
        duration: 1.5,
        easeLinearity: 0.25
    });
};


// ── CONTROLLER LAYER ──
document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view-section');
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

    initMap();
    setTimeout(() => { initMap(); }, 200);

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
            if (mapInstance) {
                mapInstance.invalidateSize();
                setTimeout(() => mapInstance.invalidateSize(), 50);
                setTimeout(() => mapInstance.invalidateSize(), 200);
            }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            switchView(targetId);
        });
    });

    regionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            regionTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentRegion = tag.getAttribute('data-region');
            filterContent();
        });
    });

    categoryTags.forEach(tag => {
        tag.addEventListener('click', () => {
            categoryTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            currentCategory = tag.getAttribute('data-category');
            filterContent();
        });
    });

    function filterContent() {
        renderDirectory();
    }

    function getPhotoHtml(item) {
        if (item.photo) {
            return `<img src="${item.photo}" alt="${item.name}" class="card-img" onerror="this.onerror=null;this.style.display='none';this.insertAdjacentHTML('afterend','<div class=\\'card-img-placeholder\\'>${item.name.charAt(0)}</div>')">`;
        }
        return `<div class="card-img-placeholder">${item.name.charAt(0)}</div>`;
    }

    function renderDirectory() {
        if (!directoryList) return;
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
                <div class="card-image-wrapper">
                    ${getPhotoHtml(item)}
                </div>
                <div class="card-info">
                    <h4>${item.name}</h4>
                    <p>${item.area}</p>
                    <span class="card-category" style="background: ${categoryColors[item.category] || '#2D6A4F'}">${item.category}</span>
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
    }

    function renderGrids() {
        if (artistGrid) artistGrid.innerHTML = '';
        if (attractionsGrid) attractionsGrid.innerHTML = '';
        if (festivalsGrid) festivalsGrid.innerHTML = '';

        if (!window.directoryData) return;

        window.directoryData.forEach(item => {
            const card = createGridCard(item);

            if (item.category === 'Artists' && artistGrid) {
                artistGrid.appendChild(card);
            } else if (['Museums', 'Galleries', 'Heritage', 'Nature', 'Cultural Sites', 'Creative Businesses', 'Workshops', 'Public Art'].includes(item.category) && attractionsGrid) {
                const clone = createGridCard(item);
                attractionsGrid.appendChild(clone);
            } else if (item.category === 'Festivals' && festivalsGrid) {
                const clone = createGridCard(item);
                festivalsGrid.appendChild(clone);
            }
        });
    }

    function createGridCard(item) {
        const card = document.createElement('div');
        card.className = 'directory-card premium-grid-card';
        card.innerHTML = `
            <div class="grid-card-visual">
                ${getPhotoHtml(item)}
                <div class="grid-card-overlay">
                    <span class="grid-card-category">${item.category}</span>
                </div>
            </div>
            <div class="card-info">
                <h4>${item.name}</h4>
                <p class="grid-card-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    ${item.area}
                </p>
                <p class="grid-card-desc">${item.description}</p>
                <button class="btn-view-profile">View Profile</button>
            </div>
        `;
        card.addEventListener('click', () => openModal(item));
        return card;
    }

    function openModal(item) {
        const modalImg = document.getElementById('modal-img');
        if (item.photo) {
            modalImg.src = item.photo;
            modalImg.parentElement.style.display = 'block';
        } else {
            modalImg.parentElement.style.display = 'none';
        }
        
        document.getElementById('modal-title').textContent = item.name;
        document.getElementById('modal-category').textContent = item.category;
        document.getElementById('modal-region').textContent = item.region;
        document.getElementById('modal-desc').textContent = item.description;
        document.getElementById('modal-area').textContent = item.area;
        document.getElementById('modal-contact').textContent = item.contact;
        
        const addrContainer = document.getElementById('modal-address-container');
        if (item.address) {
            addrContainer.style.display = 'flex';
            document.getElementById('modal-address').textContent = item.address;
        } else {
            addrContainer.style.display = 'none';
        }

        modal.classList.add('active');

        document.getElementById('btn-view-on-map').onclick = () => {
            modal.classList.remove('active');
            switchView('map-view');
            setTimeout(() => window.zoomToLocation(item.id), 350);
        };
    }

    window.showProfile = (id) => {
        const item = window.directoryData.find(d => d.id === id);
        if (item) openModal(item);
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });

    renderDirectory();
    renderGrids();
});
