// Simple Manual Auth Logic (Firestore Only)
document.addEventListener('DOMContentLoaded', () => {
    const loginFormWrapper = document.getElementById('loginForm');
    const signupFormWrapper = document.getElementById('signupForm');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const formLogin = document.getElementById('formLogin');
    const formSignup = document.getElementById('formSignup');
    const authAlert = document.getElementById('authAlert');

    if (showSignupLink && showLoginLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormWrapper.style.display = 'none';
            signupFormWrapper.style.display = 'block';
            hideAlert();
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupFormWrapper.style.display = 'none';
            loginFormWrapper.style.display = 'block';
            hideAlert();
        });
    }

    // Handle URL parameters for mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'signup') {
        if (loginFormWrapper) loginFormWrapper.style.display = 'none';
        if (signupFormWrapper) signupFormWrapper.style.display = 'block';
    }

    function showAlert(msg, isError = true) {
        if (!authAlert) return;
        authAlert.style.display = 'block';
        authAlert.className = 'alert ' + (isError ? 'alert-error' : 'alert-success');
        authAlert.textContent = msg;
    }

    function hideAlert() {
        if (!authAlert) return;
        authAlert.style.display = 'none';
    }

    // Login logic: Search Firestore directly
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('loginPhone').value.trim();
            const password = document.getElementById('loginPassword').value;
            const btn = document.getElementById('btnLogin');

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحقق...';

            try {
                // Ensure db is loaded (check window.db as well)
                const firestore = db || window.db;
                if (!firestore) throw new Error("قاعدة البيانات غير متصلة. يرجى التأكد من تحميل firebase-config.js بشكل صحيح.");

                const snapshot = await firestore.collection('brokers')
                    .where('phone', '==', phone)
                    .where('password', '==', password)
                    .get();

                if (!snapshot.empty) {
                    const brokerData = snapshot.docs[0].data();
                    const brokerId = snapshot.docs[0].id;

                    localStorage.setItem('brokerLogged', 'true');
                    localStorage.setItem('brokerId', brokerId);
                    localStorage.setItem('brokerName', brokerData.name);
                    localStorage.setItem('brokerPhone', brokerData.phone);

                    showAlert("تم تسجيل الدخول بنجاح!", false);
                    setTimeout(() => window.location.href = "index.html", 1000);
                } else {
                    showAlert("رقم الهاتف أو كلمة المرور غير صحيحة.");
                    btn.disabled = false;
                    btn.innerHTML = 'تسجيل الدخول';
                }
            } catch (error) {
                console.error("Login Error:", error);
                showAlert("حدث خطأ في الاتصال: " + (error.message || "تأكد من إعدادات Firebase"));
                btn.disabled = false;
                btn.innerHTML = 'تسجيل الدخول';
            }
        });
    }

    // Signup logic: Save to Firestore directly
    if (formSignup) {
        formSignup.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const phone = document.getElementById('signupPhone').value.trim();
            const password = document.getElementById('signupPassword').value;
            const btn = document.getElementById('btnSignup');

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الحفظ...';

            try {
                const firestore = db || window.db;
                if (!firestore) throw new Error("قاعدة البيانات غير متصلة.");

                const check = await firestore.collection('brokers').where('phone', '==', phone).get();
                if (!check.empty) {
                    showAlert("هذا الرقم مسجل بالفعل.");
                    btn.disabled = false;
                    btn.innerHTML = 'إنشاء الحساب';
                    return;
                }

                const newBrokerRef = await firestore.collection('brokers').add({
                    name: name,
                    phone: phone,
                    password: password,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                // Auto Login
                localStorage.setItem('brokerLogged', 'true');
                localStorage.setItem('brokerId', newBrokerRef.id);
                localStorage.setItem('brokerName', name);
                localStorage.setItem('brokerPhone', phone);

                showAlert("تم إنشاء الحساب وتسجيل دخولك بنجاح!", false);
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1500);
            } catch (error) {
                console.error("Signup Error:", error);
                showAlert("حدث خطأ أثناء الحفظ: " + (error.message || "تأكد من اتصالك بالإنترنت"));
                btn.disabled = false;
                btn.innerHTML = 'إنشاء الحساب';
            }
        });
    }
});
