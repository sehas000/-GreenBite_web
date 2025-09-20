document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('details-content');
    const urlParams = new URLSearchParams(window.location.search);
    const exerciseId = parseInt(urlParams.get('id'));

    if (!exerciseId) {
        content.innerHTML = '<p>Exercise not found. Please go back to the generator.</p>';
        return;
    }
    fetch('data/workouts.json')
        .then(res => res.json())
        .then(allExercises => {
            const exercise = allExercises.find(ex => ex.id === exerciseId);

            if (exercise) {
                displayExerciseDetails(exercise);
            } else {
                content.innerHTML = '<p>Could not find details for this exercise.</p>';
            }
        });

    function displayExerciseDetails(ex) {
        document.title = `${ex.name} - GreenBite`; 

        const instructionsHtml = ex.instructions.map(step => `<li>${step}</li>`).join('');
        const safetyTipsHtml = ex.safetyTips.map(tip => `<li><i class="fas fa-check-circle"></i> ${tip}</li>`).join('');

        content.innerHTML = `
            <div class="details-header">
                <h1>${ex.name}</h1>
                <p>${ex.description}</p>
            </div>

            <div class="details-grid">
                <div class="instructions-section">
                    <h2>Instructions</h2>
                    <ol class="instructions-list">${instructionsHtml}</ol>
                </div>
                <div class="details-image">
                    <img src="${ex.demoImage}" alt="Demonstration of ${ex.name}">
                    <a href="#" class="btn">Start Exercise Timer</a>
                </div>
            </div>

            <section class="safety-section">
                <h2>Safety & Best Practices</h2>
                <ul class="safety-list">${safetyTipsHtml}</ul>
            </section>

            <div class="page-actions">
                <a href="workout-generator.html" class="btn-secondary">Back to Workout Generator</a>
            </div>
        `;
    }
});
