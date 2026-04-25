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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

var db = firebase.firestore();
var storage = firebase.storage();
var auth = firebase.auth();
