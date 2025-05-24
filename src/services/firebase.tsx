// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB7O_hkpDS266BbZRQtWFzOrn0jK2y3K6U",
  authDomain: "authentication-bf2a7.firebaseapp.com",
  projectId: "authentication-bf2a7",
  storageBucket: "authentication-bf2a7.appspot.com",
  messagingSenderId: "375284713381",
  appId: "1:375284713381:web:083f88f5ba2a2fab658a4c",
  measurementId: "G-W89BM4HVZ1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
