// PWA Installation & Service Worker Handler
let deferredPrompt;

// 1. Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(reg => {
            console.log('SW Registered');
        }).catch(err => {
            console.log('SW Registration Failed', err);
        });
    });
}

// 2. Handle Installation Prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install elements if not dismissed
    if (!localStorage.getItem('pwaBannerDismissed')) {
        setTimeout(() => {
            const banner = document.getElementById('pwaBanner');
            const btns = document.querySelectorAll('.pwa-install-btn');
            
            if (banner) banner.style.bottom = '0';
            btns.forEach(btn => btn.style.display = 'inline-flex');
        }, 3000);
    }
});

// 3. Trigger Installation
function triggerPwaInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                hidePwaElements();
            }
            deferredPrompt = null;
        });
    }
}

function hidePwaElements() {
    const banner = document.getElementById('pwaBanner');
    const btns = document.querySelectorAll('.pwa-install-btn');
    if (banner) banner.style.bottom = '-150px';
    btns.forEach(btn => btn.style.display = 'none');
}

// 4. Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const installBannerBtn = document.getElementById('installBannerBtn');
    const closeBanner = document.getElementById('closeBanner');
    const globalInstallBtns = document.querySelectorAll('.pwa-install-btn');

    if (installBannerBtn) installBannerBtn.addEventListener('click', triggerPwaInstall);
    
    globalInstallBtns.forEach(btn => {
        btn.addEventListener('click', triggerPwaInstall);
    });

    if (closeBanner) {
        closeBanner.addEventListener('click', () => {
            const banner = document.getElementById('pwaBanner');
            if (banner) banner.style.bottom = '-150px';
            localStorage.setItem('pwaBannerDismissed', 'true');
        });
    }
});

window.addEventListener('appinstalled', (evt) => {
    hidePwaElements();
    console.log('App Installed Successfully');
});
