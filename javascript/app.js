if('serviceWorker' in navigator){
    //Register sw
    navigator.serviceWorker.register('/javascript/serviceworker.js')
    .then((reg) => console.log('service worker registered', reg))
    .catch((err) => console.log('service worker not registered', err))
}