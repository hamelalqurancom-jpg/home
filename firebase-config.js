const firebaseConfig = {
  apiKey: "AIzaSyCGEHnD4MXQjWZTz5csZ8hAC72UvR1FX-U",
  authDomain: "estebain-1906b.firebaseapp.com",
  projectId: "estebain-1906b",
  storageBucket: "estebain-1906b.firebasestorage.app",
  messagingSenderId: "32544885408",
  appId: "1:32544885408:web:ad7160dca975a11d6157c5",
  measurementId: "G-ZT4EFCQPZ7"
};

// Initialize Firebase
var app, db, storage, auth;

try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            app = firebase.initializeApp(firebaseConfig);
        } else {
            app = firebase.app();
        }
        
        // Initialize services
        db = firebase.firestore();
        storage = firebase.storage();
        auth = firebase.auth();
        
        console.log("Firebase Connected: estebain-1906b");
    }
} catch (error) {
    console.error("Firebase Error:", error);
}
