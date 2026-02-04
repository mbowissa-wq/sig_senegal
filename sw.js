const CACHE_NAME = 'sig-senegal-cache-v2';
const DATA_CACHE_NAME = 'sig-senegal-data-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './css/fontawesome-all.min.css',
    './css/L.Control.Layers.Tree.css',
    './css/L.Control.Locate.min.css',
    './css/leaflet-measure.css',
    './css/leaflet.css',
    './css/leaflet.photon.css',
    './css/MarkerCluster.css',
    './css/MarkerCluster.Default.css',
    './css/qgis2web.css',
    './css/images/layers-2x.png',
    './css/images/layers.png',
    './css/images/marker-icon-2x.png',
    './css/images/marker-icon.png',
    './css/images/marker-shadow.png',
    './js/Autolinker.min.js',
    './js/L.Control.Layers.Tree.min.js',
    './js/L.Control.Locate.min.js',
    './js/labelgun.min.js',
    './js/labels.js',
    './js/leaflet-hash.js',
    './js/leaflet-heat.js',
    './js/leaflet-measure.js',
    './js/leaflet-svg-shape-markers.min.js',
    './js/leaflet-tilelayer-wmts.js',
    './js/leaflet.js',
    './js/leaflet.markercluster.js',
    './js/leaflet.pattern.js',
    './js/leaflet.photon.js',
    './js/leaflet.rotatedMarker.js',
    './js/Leaflet.VectorGrid.js',
    './js/leaflet.wms.js',
    './js/multi-style-layer.js',
    './js/OSMBuildings-Leaflet.js',
    './js/qgis2web_expressions.js',
    './js/rbush.min.js',
    './data/Arrondissement_3.js',
    './data/Departement_2.js',
    './data/localites_5.js',
    './data/Region_1.js',
    './data/Routes_4.js',
    './webfonts/fa-solid-900.woff2'
];

// Install the service worker and cache the app shell
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// Fetch event: serve from cache or fetch from network
self.addEventListener('fetch', function(event) {
    const requestUrl = new URL(event.request.url);

    // Cache strategy for map tiles (cache-first, then network)
    if (requestUrl.hostname.includes('.tile.openstreetmap.org')) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(function(cache) {
                return cache.match(event.request).then(function(response) {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then(function(networkResponse) {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // Cache-first strategy for all other requests
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
