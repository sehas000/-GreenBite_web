document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const feedbackEl = document.getElementById('form-feedback');

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); 
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === '' || email === '' || message === '') {
                feedbackEl.textContent = 'Please fill out all fields.';
                feedbackEl.style.color = 'red';
                return; 
            }
            if (!email.includes('@') || !email.includes('.')) {
                feedbackEl.textContent = 'Please enter a valid email address.';
                feedbackEl.style.color = 'red';
                return;
            }

            const feedbackData = {
                name: name,
                email: email,
                message: message,
                date: new Date().toISOString()
            };

            let allFeedback = JSON.parse(localStorage.getItem('userFeedback')) || [];
            allFeedback.push(feedbackData);
            localStorage.setItem('userFeedback', JSON.stringify(allFeedback));
            window.location.href = 'thank-you.html';
        });
    }
});
