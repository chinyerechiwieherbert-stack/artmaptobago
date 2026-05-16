let mapInstance;
let markers = [];
let hotspots = [];
let mapInitialized = false;

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

function initMap() {
    if (mapInitialized) return;
    mapInitialized = true;

    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const w = 5325;
    const h = 3525;
    
    // Bounds are [bottom-left, top-right] in units
    // Standard CRS.Simple: y increases upwards, so top-left is (0,0) -> lat=0, lng=0
    // Bottom-right is (w,h) -> lat=-h, lng=w
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

    L.imageOverlay('assets/tobago_art_map.jpg', bounds).addTo(mapInstance);
    
    // Center the map
    mapInstance.fitBounds(bounds);
    
    // Optional: force a slight zoom out if needed to show the whole map
    // mapInstance.setZoom(-2); 

    window.map = mapInstance;

    // Add Zoom controls
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

    // Interactive markers (dots) removed as per user request to avoid alignment issues
    // markers array remains available for API consistency but will be empty
}

function getMarkerHtml(item) {
    if (item.photo) {
        return `<img src="${item.photo}" alt="${item.name}">`;
    }
    return `<div class="marker-icon-fallback">${item.name.charAt(0)}</div>`;
}

function getPopupHtml(item) {
    return `
        <div class="popup-premium">
            <h4>${item.name}</h4>
            <p>${item.area}</p>
            <button onclick="window.showProfile('${item.id}')">View Full Profile</button>
        </div>
    `;
}

// ── Public API ──
window.initMapIfNeeded = () => {
    initMap();
};

window.zoomToLocation = (id) => {
    const item = window.directoryData.find(d => d.id === id);
    if (!item || !mapInstance) return;

    let target;
    let zoomLevel = 0;

    // Prioritize the photo box for visible centering on the artwork
    // Since markers were removed, zooming to the photo is more helpful
    if (item.box) {
        const [bx, by, bw, bh] = item.box;
        // Center of the box
        const cx = bx + (bw / 2);
        const cy = by + (bh / 2);
        target = [-cy, cx];
        zoomLevel = 0.5; // Zoom in a bit more on the photo
    } else if (item.dot) {
        const [x, y] = item.dot;
        target = [-y, x];
        zoomLevel = 0;
    }

    if (target) {
        mapInstance.flyTo(target, zoomLevel, { duration: 1.5 });
    }
};

window.highlightHotspot = (id) => {
    const entry = markers.find(m => m.item.id === id);
    if (entry) {
        entry.marker.setStyle({ 
            radius: 12,
            fillOpacity: 1, 
            weight: 3
        });
        entry.marker.openTooltip();
    }
};

window.unhighlightHotspot = (id) => {
    const entry = markers.find(m => m.item.id === id);
    if (entry) {
        entry.marker.setStyle({ 
            radius: 8,
            fillOpacity: 0.8,
            weight: 2
        });
        entry.marker.closeTooltip();
    }
};

window.filterMap = (region, category) => {
    markers.forEach(m => {
        const regionMatch = region === 'All' || m.item.region === region;
        const categoryMatch = category === 'All' || m.item.category === category;
        if (regionMatch && categoryMatch) {
            m.marker.addTo(mapInstance);
        } else {
            m.marker.remove();
        }
    });
};
