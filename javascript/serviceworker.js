//When installed, prompt console that it has been. No need to reinstall on every install, 
// only when SW changes. 
self.addEventListener('install', evt => {
    console.log('sw installed to device.');
});
//Activate the Service Worker
self.addEventListener('activate', evt => {
    console.log('sw activated.');
});

//Begin Fetch Event logging
self.addEventListener('fetch', evt =>{
    console.log('fetch event occured', evt);
});