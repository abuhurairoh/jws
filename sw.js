/*
<script src="vendor/jquery/jquery.min.js"></script>
<script src="vendor/moment/moment-with-locales.js"></script>
<script src="vendor/bootstrap/js/bootstrap.min.js"></script>
<script src="vendor/adhan/Adhan.js"></script>
<script src="vendor/moment-hijri/moment-hijri.js"></script>
<script src="vendor/nosleep/NoSleep.min.js"></script>
<script src="vendor/ckeditor/ckeditor.js"></script>
<script src="js/app.js"></script>
<script src="js/settings.js"></script>
var videoList = ["videos/tawaf.mp4","videos/everest.mp4","videos/dayandnight.mp4"];
*/
var CACHE_NAME = 'my-site-cache-v0.0.01';
var urlsToCache = [
  '/jamsholat2/'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    console.log("Installing service worker");

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

        return fetch(event.request).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );

      }
    )
  );
});  
