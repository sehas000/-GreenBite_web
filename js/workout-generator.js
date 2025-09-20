document.addEventListener('DOMContentLoaded', () => {
    const workoutForm = document.getElementById('workout-form');
    const workoutPlanSection = document.getElementById('workout-plan');
    const workoutList = document.getElementById('workout-list');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const saveBtn = document.getElementById('save-workout-btn');

    let allExercises = [];
    let currentWorkout = [];
    const activeTimers = {}; 

    const completionSound = new Audio('sounds/timer-complete.mp3');

    fetch('data/workouts.json')
        .then(res => res.json())
        .then(data => {
            allExercises = data.filter(item => item.type === 'exercise');
        })
        .catch(error => console.error("Error fetching workouts:", error));

    function startTimer(duration, displayElement, cardElement, exerciseId) {
        if (activeTimers[exerciseId]) {
            clearInterval(activeTimers[exerciseId]);
        }

        let timer = duration;
        activeTimers[exerciseId] = setInterval(() => {
            const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
            const seconds = (timer % 60).toString().padStart(2, '0');
            displayElement.textContent = `${minutes}:${seconds}`;

            if (--timer < 0) {
                clearInterval(activeTimers[exerciseId]);
                displayElement.textContent = "Done!";
                cardElement.classList.add('timer-finished');
                completionSound.play(); 
                setTimeout(() => cardElement.classList.remove('timer-finished'), 1000);
            }
        }, 1000);
    }

    function resetTimer(duration, displayElement, exerciseId) {
        if (activeTimers[exerciseId]) {
            clearInterval(activeTimers[exerciseId]);
        }
        const minutes = Math.floor(duration / 60).toString().padStart(2, '0');
        const seconds = (duration % 60).toString().padStart(2, '0');
        displayElement.textContent = `${minutes}:${seconds}`;
    }

    workoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        generateWorkout();
    });

    shuffleBtn.addEventListener('click', generateWorkout);

    function generateWorkout() {
        const selectedBodyParts = Array.from(document.querySelectorAll('input[name="bodyPart"]:checked')).map(el => el.value);
        const selectedEquipment = Array.from(document.querySelectorAll('input[name="equipment"]:checked')).map(el => el.value);
        if (selectedBodyParts.length === 0 || selectedEquipment.length === 0) {
            alert('Please select at least one body part and one equipment type.');
            return;
        }
        let filtered = allExercises.filter(ex => {
            const hasBodyPart = selectedBodyParts.some(part => ex.bodyPart.includes(part));
            const hasEquipment = selectedEquipment.some(equip => ex.equipment.includes(equip));
            return hasBodyPart && hasEquipment;
        });
        currentWorkout = filtered.sort(() => 0.5 - Math.random()).slice(0, 4); 
        displayWorkout(currentWorkout);
    }

    function displayWorkout(workout) {
        workoutList.innerHTML = '';
        if (workout.length === 0) {
            workoutList.innerHTML = `<p>No exercises found. Please try different filters.</p>`;
            workoutPlanSection.classList.add('hidden');
            return;
        }

        workout.forEach(ex => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.innerHTML = `
                <img src="${ex.icon}" alt="${ex.name}">
                <h3>${ex.name}</h3>
                <p>${ex.description}</p>
                <div class="exercise-timer-display">01:00</div>
                <div class="exercise-controls">
                    <button class="btn start-btn"><i class="fas fa-play"></i> Start</button>
                    <button class="btn-secondary reset-btn"><i class="fas fa-undo"></i> Reset</button>
                </div>
                <a href="workout-details.html?id=${ex.id}" class="btn-secondary" style="margin-top: 10px;">View Details</a>
            `;

            const timerDisplay = card.querySelector('.exercise-timer-display');
            const startBtn = card.querySelector('.start-btn');
            const resetBtn = card.querySelector('.reset-btn');
            
            startBtn.addEventListener('click', () => startTimer(60, timerDisplay, card, ex.id));
            resetBtn.addEventListener('click', () => resetTimer(60, timerDisplay, ex.id));

            workoutList.appendChild(card);
        });
        
        workoutPlanSection.classList.remove('hidden');
    }

    saveBtn.addEventListener('click', () => {
        if (currentWorkout.length === 0) {
            alert('Please generate a workout first before saving.');
            return;
        }
        let history = JSON.parse(localStorage.getItem('workoutHistory')) || [];
        const newEntry = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            planIds: currentWorkout.map(ex => ex.id)
        };
        history.unshift(newEntry);
        localStorage.setItem('workoutHistory', JSON.stringify(history));
        alert('Workout saved to your history!');
    });
});