// Firebase Configuration and Initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, limit } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpEnJZgQ1f_S0eBWBRaaL0fZwH6i0R3nc",
  authDomain: "puzzle-international.firebaseapp.com",
  projectId: "puzzle-international",
  storageBucket: "puzzle-international.firebasestorage.app",
  messagingSenderId: "733924427632",
  appId: "1:733924427632:web:a75265b51e660991f831b5",
  measurementId: "G-3Q7QJWQHFD"
};

// Initialize Firebase
let app;
let db;
let isFirebaseEnabled = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  isFirebaseEnabled = true;
  console.log('🔥 Firebase initialized successfully - Global highscores enabled!');
} catch (error) {
  console.warn('Firebase initialization failed - using localStorage fallback:', error);
  isFirebaseEnabled = false;
}

// Export Firebase utilities
export { db, isFirebaseEnabled, collection, addDoc, getDocs, query, orderBy, onSnapshot, limit };
