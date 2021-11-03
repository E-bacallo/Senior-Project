const openCache = 'static-cache-v1';
const dynamicCache = 'dynamic-cache-v1';
//Const to store page assets ready to cache.
const pageAssets = [
'/', 
'/pages/index.html',
'/pages/fallback.html', 
'/javascript/app.js', 
'/javascript/userinterface.js', 
'/javascript/materialize.min.js',
'/css/style.css',
'/css/materialize.min.css',
'https://fonts.googleapis.com/icon?family=Material+Icons',
'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIh8tQ.woff2'
];

/*
    When installed, prompt console that it has been. 
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
/*
    On Activate, see if any assets (keys) 
    are missing, download them and delete the old version 
*/
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys =>{
            return Promise.all(keys.filter(key => key != openCache && key !== dynamicCache)
            .map(key => caches.delete())
            )
        })
    );
});

/*      
    Match assets from the cache to the assets that are needed
    to load the page. If the asset the user interacts 
    with is in the cache, then return the response. 
    If the asset is missing, add the needed asset to
    the dynamic cache. If offline and cannot fetch page, return to
    fallback page.
*/
self.addEventListener('fetch', evt =>{
    evt.respondWith(
        caches.match(evt.request).then(cacheResponse => {   
            return cacheResponse || fetch(evt.request).then(fetchResponse => {
                return caches.open(dynamicCache).then(cache => {
                    cache.put(evt.request.url, fetchResponse.clone());
                    return fetchResponse;
                })
            });   
        }).catch(() => caches.match('/pages/fallback.html'))
    );
});