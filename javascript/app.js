if('serviceWorker' in navigator){
    //Register sw
    navigator.serviceWorker.register('/pages/serviceworker.js')
    .then((reg) => console.log('sw registered!', reg))
    .catch((err) => console.log('sw not registered!', err))
}