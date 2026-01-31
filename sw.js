const CACHE_NAME = 'sig-senegal-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/leaflet.css',
    '/css/qgis2web.css',
    '/css/fontawesome-all.min.css',
    '/css/leaflet-measure.css',
    '/js/leaflet.js',
    '/js/leaflet-measure.js',
    '/data/Region_1.js',
    '/data/Departement_2.js',
    '/data/Arrondissement_3.js',
    '/data/Routes_4.js',
    '/data/localites_5.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
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