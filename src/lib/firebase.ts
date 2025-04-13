
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1XGnOR3HheqON9sZ0nuhIrykS8LPVjQ8",
  authDomain: "nextlivedocs.firebaseapp.com",
  projectId: "nextlivedocs",
  storageBucket: "nextlivedocs.firebasestorage.app",
  messagingSenderId: "474426834762",
  appId: "1:474426834762:web:faf2079ba0bc3dcbed8bb3",
  measurementId: "G-5N98KZY4CT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
