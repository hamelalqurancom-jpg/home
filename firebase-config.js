const firebaseConfig = {
    // تذكير: تأكد من إضافة رابط موقعك (مثل GitHub Pages) إلى Authorized Domains في لوحة تحكم Firebase
    apiKey: "AIzaSyCGEHnD4MXQjWZTz5csZ8hAC72UvR1FX-U",
    authDomain: "estebain-1906b.firebaseapp.com",
    projectId: "estebain-1906b",
    storageBucket: "estebain-1906b.firebasestorage.app",
    messagingSenderId: "32544885408",
    appId: "1:32544885408:web:ad7160dca975a11d6157c5",
    measurementId: "G-ZT4EFCQPZ7"
};

// Cloudinary Configuration (As per point #5 of best practices)
const cloudinaryConfig = {
    cloudName: 'dwrhl6gjf', 
    uploadPreset: 'asr-kareem' 
};

// Initialize Firebase with Error Handling
var db, storage;

try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase Initialized Successfully");
        }
        db = firebase.firestore();
        storage = firebase.storage();
        
        // Expose globally to window for legacy scripts
        window.db = db;
        window.storage = storage;
    } else {
        console.error("Firebase SDK not loaded!");
    }
} catch (error) {
    console.error("Firebase Initialization Error:", error);
    alert("خطأ في الاتصال بقاعدة البيانات. يرجى التحقق من الإعدادات.");
}
