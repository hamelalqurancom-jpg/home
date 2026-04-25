// Simple Auth logic using Firestore only
document.addEventListener('DOMContentLoaded', () => {
    const loginFormWrapper = document.getElementById('loginForm');
    const signupFormWrapper = document.getElementById('signupForm');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const formLogin = document.getElementById('formLogin');
    const formSignup = document.getElementById('formSignup');
    const authAlert = document.getElementById('authAlert');

    // Handle Toggle Forms
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

    // Login Submission (Simple Check)
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('loginPhone').value.trim();
            const password = document.getElementById('loginPassword').value;
            const btn = document.getElementById('btnLogin');

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحقق...';

            try {
                // Search for broker with matching phone and password
                const snapshot = await db.collection('brokers')
                    .where('phone', '==', phone)
                    .where('password', '==', password)
                    .get();

                if (!snapshot.empty) {
                    const brokerData = snapshot.docs[0].data();
                    const brokerId = snapshot.docs[0].id;

                    // Save session locally
                    localStorage.setItem('brokerLogged', 'true');
                    localStorage.setItem('brokerId', brokerId);
                    localStorage.setItem('brokerName', brokerData.name);
                    localStorage.setItem('brokerPhone', brokerData.phone);

                    showAlert("تم تسجيل الدخول بنجاح! جاري التوجيه...", false);
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 1500);
                } else {
                    showAlert("رقم الهاتف أو كلمة المرور غير صحيحة.");
                    btn.disabled = false;
                    btn.innerHTML = 'تسجيل الدخول';
                }
            } catch (error) {
                console.error(error);
                showAlert("حدث خطأ أثناء الاتصال بقاعدة البيانات.");
                btn.disabled = false;
            }
        });
    }

    // Signup Submission (Simple Store)
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
                // Check if phone already exists
                const checkSnapshot = await db.collection('brokers').where('phone', '==', phone).get();
                if (!checkSnapshot.empty) {
                    showAlert("رقم الهاتف هذا مسجل بالفعل.");
                    btn.disabled = false;
                    return;
                }

                // Simply add to Firestore
                await db.collection('brokers').add({
                    name: name,
                    phone: phone,
                    password: password,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                showAlert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.", false);
                setTimeout(() => {
                    signupFormWrapper.style.display = 'none';
                    loginFormWrapper.style.display = 'block';
                    formSignup.reset();
                    btn.disabled = false;
                    btn.innerHTML = 'إنشاء الحساب';
                }, 2000);

            } catch (error) {
                console.error(error);
                showAlert("حدث خطأ أثناء حفظ البيانات.");
                btn.disabled = false;
            }
        });
    }
});
