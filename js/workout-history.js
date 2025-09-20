document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('history-list');
    let allExercisesData = []; 
    let workoutHistory = []; 
    fetch('data/workouts.json')
        .then(res => res.json())
        .then(data => {
            allExercisesData = data.filter(item => item.type === 'exercise');
            loadAndDisplayHistory();
        });
    function loadAndDisplayHistory() {
        workoutHistory = JSON.parse(localStorage.getItem('workoutHistory')) || [];
        
        historyList.innerHTML = '';
        if (workoutHistory.length === 0) {
            historyList.innerHTML = '<p>Your workout history is empty. Go to the generator to create and save a new workout!</p>';
            return;
        }

        workoutHistory.forEach(entry => {
            const workoutExercises = entry.planIds.map(id => allExercisesData.find(ex => ex.id === id)).filter(Boolean);
            
            const card = document.createElement('div');
            card.className = 'history-card';
            card.dataset.id = entry.id;

            const exercisesHtml = workoutExercises.map(ex => `<li>${ex.name}</li>`).slice(0, 4).join(''); // Show first 4

            card.innerHTML = `
                <img src="${workoutExercises[0]?.icon || 'path/to/default.jpg'}" alt="Workout">
                <div class="history-card-content">
                    <h3>Workout Plan</h3>
                    <div class="card-meta">
                        <span><i class="fas fa-calendar-alt"></i> ${entry.date}</span>
                        <span><i class="fas fa-dumbbell"></i> ${workoutExercises.length} exercises</span>
                    </div>
                    <ul class="exercise-list">
                        ${exercisesHtml}
                    </ul>
                    <div class="card-actions">
                        <a href="#" class="btn-secondary view-details-btn">View Details</a>
                        <button class="delete-btn" data-id="${entry.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>`;
            historyList.appendChild(card);
        });
    }
    historyList.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
            const btn = e.target.closest('.delete-btn');
            const entryId = parseInt(btn.dataset.id);

            if (confirm('Are you sure you want to delete this workout from your history?')) {
                workoutHistory = workoutHistory.filter(entry => entry.id !== entryId);
                localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
                document.querySelector(`.history-card[data-id='${entryId}']`).remove();
            }
        }
    });
});
