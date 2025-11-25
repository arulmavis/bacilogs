// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// IMPORTANT: Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyDgRS3-jZzTL-0OLyI-IFttDkQtwbQWUXA",
  authDomain: "bacilogs.firebaseapp.com",
  projectId: "bacilogs",
  storageBucket: "bacilogs.firebasestorage.app",
  messagingSenderId: "674053463680",
  appId: "1:674053463680:web:4ce5d645a8375639e69065",
  measurementId: "G-64S57DC1Y2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service and auth service
export const db = getFirestore(app);
export const auth = getAuth(app);