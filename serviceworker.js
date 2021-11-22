const openCache = 'static-cache-v2';
const dynamicCache = 'dynamic-cache-v10';
//Const to store page assets ready to cache.
const pageAssets = [
'/', 
'/index.html',
'/pages/fallback.html', 
'/javascript/app.js', 
'/javascript/userinterface.js', 
'/javascript/materialize.min.js',
'/javascript/database.js',
'/css/style.css',
'/css/materialize.min.css',
'https://fonts.googleapis.com/icon?family=Material+Icons',
'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIh8tQ.woff2'
];

/*
    Recursive function to limit size of the cache by deleting 
    the first item in the keys array 
    if size is greater than specified.
*/
const limitCache = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCache(name, size))
            }
        })
    })
};

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
    the dynamic cache. If offline and missing resource is a page, 
    send user to fallback page.
*/
self.addEventListener('fetch', evt =>{
    if(evt.request.url.indexOf('firestore.googleapis.com') === -1){
        evt.respondWith(
            caches.match(evt.request).then(cacheResponse => {   
                return cacheResponse || fetch(evt.request).then(fetchResponse => {
                    return caches.open(dynamicCache).then(cache => {
                        cache.put(evt.request.url, fetchResponse.clone());
                        limitCache(dynamicCache, 15);
                        return fetchResponse;
                    })
                });   
            }).catch(() => {
                if(evt.request.url.indexOf('.html') > -1){
                caches.match('/pages/fallback.html')
                }
            })
        );
    }
});