let mapInstance;
let markers = [];
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
    
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Ensure the container has dimensions before initialization
    if (mapContainer.clientHeight === 0) {
        mapContainer.style.minHeight = "400px"; 
    }

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

    // Build interactive hotspots safely
    if (window.directoryData && Array.isArray(window.directoryData)) {
        window.directoryData.forEach(item => {
            if (item.box) {
                const [bx, by, bw, bh] = item.box;
                const rectBounds = [[-(by + bh), bx], [-by, bx + bw]];
                
                const hotspot = L.rectangle(rectBounds, {
                    color: categoryColors[item.category] || '#2D6A4F',
                    weight: 1.5,
                    fillColor: categoryColors[item.category] || '#2D6A4F',
                    fillOpacity: 0.15,
                    className: 'map-marker'
                }).addTo(mapInstance);

                hotspot.bindTooltip(item.name, {
                    className: 'premium-map-tooltip',
                    direction: 'top',
                    sticky: true
                });

                hotspot.bindPopup(`
                    <div class="popup-premium">
                        <h4>${item.name}</h4>
                        <p>${item.area}</p>
                        <button onclick="window.showProfile('${item.id}')">View Full Profile</button>
                    </div>
                `, {
                    className: 'custom-popup-premium'
                });

                hotspot.on('click', () => {
                    if (window.highlightInDirectory) {
                        window.highlightInDirectory(item.id, true);
                    }
                });

                markers.push({
                    item: item,
                    marker: hotspot
                });
            }
        });
    }
}

// ── Public API ──
window.initMapIfNeeded = () => {
    initMap();
};

window.zoomToLocation = (id) => {
    if (!mapInstance || !window.directoryData) return;
    const item = window.directoryData.find(d => d.id === id);
    if (!item) return;

    let target;
    let zoomLevel = 0;

    if (item.box) {
        const [bx, by, bw, bh] = item.box;
        const cx = bx + (bw / 2);
        const cy = by + (bh / 2);
        target = [-cy, cx];
        zoomLevel = 0.5; 
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
    if (entry && entry.marker) {
        entry.marker.setStyle({ 
            fillOpacity: 0.4,
            weight: 3
        });
    }
};

window.unhighlightHotspot = (id) => {
    const entry = markers.find(m => m.item.id === id);
    if (entry && entry.marker) {
        entry.marker.setStyle({ 
            fillOpacity: 0.15,
            weight: 1.5
        });
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
