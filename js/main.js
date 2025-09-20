// PWA (Progressive Web App) eka wada karanna, service worker eka register kirima
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Pitauwa sampurnayenma load unata passe, me code eka wada karanna patan gannawa
document.addEventListener('DOMContentLoaded', function() {

    // --- ALUTH CODE EKA: Hamburger Menu eka wada karanna ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const mainNav = document.getElementById('main-nav');

    if (hamburgerButton && mainNav) {
        hamburgerButton.addEventListener('click', () => {
            // Hamburger button eka click kalama, nav bar eka open/close wenawa
            mainNav.classList.toggle('active');
        });
    }

    // --- ALUTH CODE EKA: Active page link eka highlight karanna ---
    // Browser eke thiyena URL eken, file eke nama gannawa (उदा: recipes.html)
    const currentPage = window.location.pathname.split("/").pop() || "index.html"; 
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        // Oba inna pitauwe link ekata "active" class eka daanawa
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active'); // Anith ewa "active" nemei kiyala pennanna
        }
    });

    // --- PARANA CODE EKA: Home Page eke Slogans maru kirima ---
    const slogans = [
        "Nourish Your Body, Elevate Your Life.",
        "Healthy Habits, Happy Life.",
        "Wellness is a Journey, Not a Destination.",
        "Eat Well, Live Well, Be Well."
    ];
    const sloganElement = document.getElementById('hero-slogan');
    if (sloganElement) {
        let currentSloganIndex = 0;
        setInterval(() => {
            currentSloganIndex = (currentSloganIndex + 1) % slogans.length;
            sloganElement.textContent = slogans[currentSloganIndex];
        }, 5000);
    }
    const healthTips = [
        "Drink at least 8 glasses of water today.",
        "Take a 15-minute walk during your lunch break.",
        "Eat a piece of fruit with your breakfast.",
        "Stretch your body for 5 minutes after waking up.",
        "Get at least 30 minutes of moderate exercise.",
        "Avoid sugary drinks and opt for water instead.",
        "Eat a balanced meal with protein, carbs, and healthy fats.",
        "Practice mindful eating: chew slowly and savor your food.",
        "Get 7-9 hours of quality sleep tonight.",
        "Take a few deep breaths when you feel stressed."
    ];
    const tipElement = document.getElementById('daily-tip');
    if (tipElement) {
        const today = new Date().getDate();
        tipElement.textContent = healthTips[(today - 1) % healthTips.length];
    }
    const newsletterForm = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    const feedbackEl = document.getElementById('newsletter-feedback');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const email = emailInput.value.trim();
            if (email === '') {
                feedbackEl.textContent = 'Please enter an email address.';
                feedbackEl.style.color = 'red';
                return; 
            }
            if (!email.includes('@') || !email.includes('.')) {
                feedbackEl.textContent = 'Please enter a valid email address.';
                feedbackEl.style.color = 'red';
                return;
            }
            let subscribedEmails = JSON.parse(localStorage.getItem('newsletterSubscriptions')) || [];
            if (subscribedEmails.includes(email)) {
                feedbackEl.textContent = 'This email is already subscribed!';
                feedbackEl.style.color = '#f39c12'; 
            } else {
                subscribedEmails.push(email);
                localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscribedEmails));
                feedbackEl.textContent = 'Thank you for subscribing!';
                feedbackEl.style.color = '#2ecc71'; 
                emailInput.value = ''; 
            }
        });
    }
});