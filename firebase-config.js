// Firebase Configuration (Replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyAfbB8f3gVpykOgxcTaBrUB7s209PLp9Lg",
  authDomain: "home-26331.firebaseapp.com",
  projectId: "home-26331",
  storageBucket: "home-26331.firebasestorage.app",
  messagingSenderId: "75590524459",
  appId: "1:75590524459:web:b2a96dcfc091bfee45d46e",
  measurementId: "G-7RC6XBPSGF"
};

// Initialize Firebase only if not already initialized
let app, db, storage, auth;
try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            app = firebase.initializeApp(firebaseConfig);
        } else {
            app = firebase.app();
        }
        db = firebase.firestore();
        storage = firebase.storage();
        auth = firebase.auth();
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}
