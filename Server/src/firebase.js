import admin from 'firebase-admin';
const credential = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY, 'base64').toString()
);

admin.initializeApp({
    credential: admin.credential.cert(credential),
    databaseURL: "https://cio-dental-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();

export default { admin, firestore };