import admin from 'firebase-admin';
import credenciales from './secret/cio-dental-firebase-adminsdk-umsiy-1788b0fbab.json' assert { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(credenciales),
    databaseURL: "https://cio-dental-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();

export default { admin, firestore };