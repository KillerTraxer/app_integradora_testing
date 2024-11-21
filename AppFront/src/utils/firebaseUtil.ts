import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore, collection, getDocs, onSnapshot , query, where, orderBy, limit, updateDoc} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAIK73AhjoyVb0WhWyl9BlmVtQ4cTB4-Us",
    authDomain: "cio-dental.firebaseapp.com",
    projectId: "cio-dental",
    storageBucket: "cio-dental.firebasestorage.app",
    messagingSenderId: "640363061542",
    appId: "1:640363061542:web:ca09ebce33b5ba5236e1e7",
    measurementId: "G-JS67JXQWXD"
};

const vapidKey = "BAkJ1UlI-zD80kVXQye13j-mqn9RR2Et1c5SuRqiBoSkRoe34QTBv3Jb-7RT6qONei5z6jTEUgh20u4EbUv76X4"

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const messaging = getMessaging(app);

const requestFCMToken = async () => {
    try {
      return Notification.requestPermission()
        .then((permission) => {
          if (permission === 'granted') {
            return getToken(messaging, { vapidKey: vapidKey })
          } else {
            throw new Error('Notification permission not granted')
          }
        })
        .catch((error) => {
          console.error('Error getting FCM token:', error);
        });
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  }

const onMessageListener = () => {
    return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        })
    })
}

export { requestFCMToken, onMessageListener, db, collection, getDocs, onSnapshot, query, where, orderBy, limit, updateDoc };