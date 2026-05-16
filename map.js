let mapInstance;
let markers = [];
let hotspots = [];
let mapInitialized = false;

function initMap() {
    if (mapInitialized) return;

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error("Map container not found");
        return;
    }

    mapInitialized = true;

    const w = 5325;
    const h = 3525;

    const bounds = [[-h, 0], [0, w]];

    mapInstance = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -3,
        maxZoom: 1,
        zoomControl: true,
        attributionControl: false,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0
    });

    // ✅ FIXED PATH (THIS WAS BREAKING YOUR MAP)
    L.imageOverlay('tobago_art_map.jpg', bounds).addTo(mapInstance);

    mapInstance.fitBounds(bounds);

    window.map = mapInstance;

    L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);
}

/* ─────────────────────────────
   SAFE GLOBAL INIT TRIGGER
──────────────────────────── */

window.initMapIfNeeded = function () {
    initMap();
};

/* ─────────────────────────────
   CRITICAL FIX: auto-init when map tab opens
──────────────────────────── */

window.addEventListener("load", () => {
    // small delay ensures DOM is ready
    setTimeout(() => {
        if (document.getElementById("map")) {
            initMap();
        }
    }, 300);
});
