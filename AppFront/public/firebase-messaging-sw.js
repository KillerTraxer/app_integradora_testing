// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyAIK73AhjoyVb0WhWyl9BlmVtQ4cTB4-Us",
    authDomain: "cio-dental.firebaseapp.com",
    projectId: "cio-dental",
    storageBucket: "cio-dental.firebasestorage.app",
    messagingSenderId: "640363061542",
    appId: "1:640363061542:web:ca09ebce33b5ba5236e1e7",
    measurementId: "G-JS67JXQWXD"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification?.title || 'Sin título';
    const notificationOptions = {
        body: payload.notification?.body || payload.data.message || 'Sin contenido',
        icon: '/logo_landing.svg',
        click_action: payload.notification?.click_action || '/index.html',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});