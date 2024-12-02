import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore, collection, getDocs, onSnapshot, query, where, orderBy, limit, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

const firebaseConfig2 = {
  apiKey: "AIzaSyBXyN_cr_9tfT4k5ovRvKfSbgBV9qw4PaY",
  authDomain: "proyecto-d19a8.firebaseapp.com",
  projectId: "proyecto-d19a8",
  storageBucket: "proyecto-d19a8.appspot.com",
  messagingSenderId: "1005098631564",
  appId: "1:1005098631564:web:73b95ea7405335dd39d6a9",
  measurementId: "G-XZB0S1DDS5"
};

const app = initializeApp(firebaseConfig);
const app2 = initializeApp(firebaseConfig2, 'proyecto-d19a8.appspot.com');

const db = getFirestore(app);
const db2 = getFirestore(app2, 'proyecto-d19a8.appspot.com');

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

const storage2 = getStorage(app2, 'proyecto-d19a8.appspot.com');


export {
  requestFCMToken,
  onMessageListener,
  db,
  db2,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  storage2,
  ref,
  uploadBytesResumable,
  getDownloadURL
};