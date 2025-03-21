import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCzauCzcDmRR6druQO9KLIHjunftykUNtc",
  authDomain: "okay-5efc3.firebaseapp.com",
  projectId: "okay-5efc3",
  storageBucket: "okay-5efc3.firebasestorage.app",
  messagingSenderId: "415922201891",
  appId: "1:415922201891:web:28d4ef3efce6cbda1c1896",
  measurementId: "G-TSDE2MXDYT"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore veritabanı referansını al
export const db = getFirestore(app); 