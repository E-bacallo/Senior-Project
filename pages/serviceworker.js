const openCache = 'static-cache-v1';
const dynamicCache = 'dynamic-cache-v1';
//Const to store page assets ready to cache.
const pageAssets = [
'/', 
'/index.html', 
'/javascript/app.js', 
'/javascript/userinterface.js', 
'/javascript/materialize.min.js',
'/css/style.css',
'/css/materialize.min.css',
'https://fonts.googleapis.com/icon?family=Material+Icons',
'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIh8tQ.woff2'
];

/*When installed, prompt console that it has been. 
No need to reinstall on every install,
only when SW changes. 
*/  
self.addEventListener('install', evt => {
    //Create a new cache, and wait until it is finished to install the SW
    evt.waitUntil(
        caches.open(openCache).then(cache => {
            console.log('cached all assets');
            cache.addAll(pageAssets);
        })
    );
});

//Activate the Service Worker
self.addEventListener('activate', evt => {
    //On Activate, delete old cache and install new one.
    evt.waitUntil(
        caches.keys().then(keys =>{
            return Promise.all(keys.filter(key => key != openCache)
            .map(key => caches.delete())
            )
        })
    );
});

//Look in the cache, and match requests to the assets.
self.addEventListener('fetch', evt =>{
    evt.respondWith(
        caches.match(evt.request).then(cacheResponse => {
            //Return the matching asset, or repeat the request.
            return cacheResponse || fetch(evt.request).then(fetchResponse => {
                return caches.open(dynamicCache).then(cache => {
                    cache.put(evt.request.url, fetchResponse.clone());
                    return fetchResponse;
                })
            });   
        })
    );
});