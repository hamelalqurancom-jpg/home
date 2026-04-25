// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfbB8f3gVpykOgxcTaBrUB7s209PLp9Lg",
  authDomain: "home-26331.firebaseapp.com",
  projectId: "home-26331",
  storageBucket: "home-26331.firebasestorage.app",
  messagingSenderId: "75590524459",
  appId: "1:75590524459:web:b2a96dcfc091bfee45d46e",
  measurementId: "G-7RC6XBPSGF"
};

// Initialize Firebase
var app, db, storage, auth;

try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            app = firebase.initializeApp(firebaseConfig);
            console.log("Firebase initialized successfully.");
        } else {
            app = firebase.app();
        }
        
        // Initialize services only if their SDKs are loaded
        if (typeof firebase.firestore === 'function') db = firebase.firestore();
        if (typeof firebase.storage === 'function') storage = firebase.storage();
        if (typeof firebase.auth === 'function') {
            auth = firebase.auth();
            console.log("Auth service is ready.");
        }
    } else {
        console.error("Firebase SDK not loaded! Make sure script tags are correct.");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}
