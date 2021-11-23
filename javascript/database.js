/*
    Function to handle offline data rendering
    from Firebase
*/
db.enablePersistence().catch(err => {
    if(err.code == 'failed-precondition'){
        //Error likely occurs because multiple tabs are loaded
        console.log('persistence failed');
    }else if(err.code == 'unimplemented'){
        //browser doesn't support persistence
        console.log('persistence is not available');
    }
});
/*
    Setting up the real time listener function
*/
db.collection('proteins').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(change =>{
        console.log(change, change.doc.data(), change.doc.id);
        if(change.type === 'added'){
            //add the data to the page
            updateItem(change.doc.data(), change.doc.id);
        }
        if(change.type === 'removed'){
            //remove the data from the page
        }
    });
});
//Add New Item to DB
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    const item = {
        shortid: form.shortid.value,
        name: form.name.value,
        relatedid: form.relatedid.value,
        relatedname: form.relatedname.value,
        relationpercent: form.relationpercent.value
    };
    db.collection('proteins').add(item)
        .catch(err => console.log(err));
    
    form.shortid.value = '';
    form.name.value = ''; 
    form.relatedid.value = ''; 
    form.relationpercent.value = '';
    
});