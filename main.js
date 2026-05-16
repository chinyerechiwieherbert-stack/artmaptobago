// Global Asset Category Colors
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

// ── ROBUST RESIZE-SAFE INITIALIZATION ENGINE ──
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // PROTECTION LINK: If container layout doesn't hold physical dimensions yet, halt
    if (mapContainer.clientWidth === 0 || mapContainer.clientHeight === 0) {
        return;
    }

    if (mapInitialized) {
        if (mapInstance) {
            mapInstance.invalidateSize({ animate: false });
        }
        return;
    }

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

    // Loading flat root image directly from your master repository layer
    L.imageOverlay('tobago_art_map.jpg', mapBounds).addTo(mapInstance);
    
    // Position map flat canvas overview directly centered on the screen box frame layout
    mapInstance.setView([-MAP_H / 2, MAP_W / 2], -2);
    window.map = mapInstance;
}

// ── POINT RE-CENTER ZOOM ENGINE ──
window.zoomToLocation = (id) => {
    if (!mapInstance || !window.directoryData) return;
    const item = window.directoryData.find(d => d.id === id);
    if (!item || !item.dot) return;

    // Horizontal coordinate is array index 0, vertical is array index 1
    const targetX = item.dot[0];
    const targetY = item.dot[1];

    // Map inverted coordinates right inside negative Leaflet CRS.Simple grid lines
    const centerPoint = [-targetY, targetX];
    
    // Zoom -0.5 brings the frame directly into tight focus over the artist's typographic text entry
    mapInstance.setView(centerPoint, -0.5);
};


// ── APPLICATION USER CONTEXT CONTROLLER LAYER ──
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

    // Build standalone displays and components seamlessly
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
            // Sequence block intervals to force rendering parameters once container is active
            initMap();
            setTimeout(() => initMap(), 50);
            setTimeout(() => {
                if (mapInstance) {
                    mapInstance.invalidateSize({ animate: false });
                    mapInstance.setView([-MAP_H / 2, MAP_W / 2], -2);
                }
            }, 150);
            setTimeout(() => {
                if (mapInstance) mapInstance.invalidateSize({ animate: false });
            }, 450);
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
    }

    function renderGrids() {
        if (!artistGrid || !attractionsGrid) return;
        artistGrid.innerHTML = '';
        attractionsGrid.innerHTML = '';
        if (festivalsGrid) festivalsGrid.innerHTML = '';

        window.directoryData.forEach(item => {
            const card = createGridCard(item);

            if (item.category === 'Artists') {
                artistGrid.appendChild(card);
            } else if (['Museums', 'Galleries', 'Heritage', 'Nature', 'Cultural Sites', 'Creative Businesses', 'Workshops', 'Public Art'].includes(item.category)) {
                const clone = createGridCard(item);
                attractionsGrid.appendChild(clone);
            }
            if (item.category === 'Festivals' && festivalsGrid) {
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
            setTimeout(() => {
                window.zoomToLocation(item.id);
            }, 350);
        };
    }

    window.highlightInDirectory = (id, scroll = true) => {
        const targetCard = document.querySelector(`.directory-card[data-id="${id}"]`);
        if (targetCard) {
            if (scroll) targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.classList.add('highlight-active');
        }
    };

    window.unhighlightInDirectory = (id) => {
        const targetCard = document.querySelector(`.directory-card[data-id="${id}"]`);
        if (targetCard) targetCard.classList.remove('highlight-active');
    };

    window.showProfile = (id) => {
        const item = window.directoryData.find(d => d.id === id);
        if (item) openModal(item);
    };

    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
    });
});
