// Auth logic for brokers
document.addEventListener('DOMContentLoaded', () => {
    const loginFormWrapper = document.getElementById('loginForm');
    const signupFormWrapper = document.getElementById('signupForm');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const formLogin = document.getElementById('formLogin');
    const formSignup = document.getElementById('formSignup');
    const authAlert = document.getElementById('authAlert');

    // Handle URL parameters (e.g. ?mode=signup)
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    if (mode === 'signup') {
        if(loginFormWrapper && signupFormWrapper) {
            loginFormWrapper.style.display = 'none';
            signupFormWrapper.style.display = 'block';
        }
    } else {
        if(loginFormWrapper && signupFormWrapper) {
            loginFormWrapper.style.display = 'block';
            signupFormWrapper.style.display = 'none';
        }
    }

    // Toggle Forms
    if (showSignupLink && showLoginLink) {
        showSignupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormWrapper.style.display = 'none';
            signupFormWrapper.style.display = 'block';
            hideAlert();
            // Update URL
            window.history.pushState({}, '', '?mode=signup');
        });

        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupFormWrapper.style.display = 'none';
            loginFormWrapper.style.display = 'block';
            hideAlert();
            // Update URL
            window.history.pushState({}, '', '?mode=login');
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

    // Login Submission
    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('loginPhone').value.trim();
            const password = document.getElementById('loginPassword').value;
            const btn = document.getElementById('btnLogin');

            if (!phone || !password) {
                showAlert("يرجى إدخال رقم الهاتف وكلمة المرور.");
                return;
            }

            const virtualEmail = phone + '@maseer.com';

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التسجيل...';

            try {
                if (typeof firebase !== 'undefined' && firebase.auth) {
                    // Actual Firebase Auth
                    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                    await firebase.auth().signInWithEmailAndPassword(virtualEmail, password);
                } else {
                    await new Promise(r => setTimeout(r, 1000));
                }
                
                showAlert("تم تسجيل الدخول بنجاح! جاري التوجيه...", false);
                
                // Redirect to dashboard (assuming broker dashboard is next)
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1500);

            } catch (error) {
                console.error(error);
                showAlert(error.message || "خطأ في بيانات الدخول، تأكد من البريد وكلمة المرور.");
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> تسجيل الدخول';
            }
        });
    }

    // Signup Submission
    if (formSignup) {
        formSignup.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const phone = document.getElementById('signupPhone').value.trim();
            const password = document.getElementById('signupPassword').value;
            const btn = document.getElementById('btnSignup');

            if (!name || !phone || !password) {
                showAlert("يرجى تعبئة جميع الحقول.");
                return;
            }

            const virtualEmail = phone + '@maseer.com';

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري الإنشاء...';

            try {
                if (typeof firebase !== 'undefined' && firebase.auth) {
                    const authInstance = firebase.auth();
                    await authInstance.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                    const userCredential = await authInstance.createUserWithEmailAndPassword(virtualEmail, password);
                    
                    // Store extra data in Firestore
                    await firebase.firestore().collection('brokers').doc(userCredential.user.uid).set({
                        name: name,
                        phone: phone,
                        password: password,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    await new Promise(r => setTimeout(r, 1000));
                }

                showAlert("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.", false);
                
                setTimeout(() => {
                    signupFormWrapper.style.display = 'none';
                    loginFormWrapper.style.display = 'block';
                    formSignup.reset();
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> إنشاء الحساب';
                    hideAlert();
                    window.history.pushState({}, '', '?mode=login');
                }, 2000);

            } catch (error) {
                console.error(error);
                showAlert(error.message || "حدث خطأ أثناء إنشاء الحساب. قد يكون البريد مستخدم بالفعل.");
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-user-plus"></i> إنشاء الحساب';
            }
        });
    }
});
