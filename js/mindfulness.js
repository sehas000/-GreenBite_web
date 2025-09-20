document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-timer-btn');
    const resetBtn = document.getElementById('reset-timer-btn');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const soundBtns = document.querySelectorAll('.sound-btn');
    const breathingText = document.getElementById('breathing-text');

    let countdown;
    let timeLeft;
    let totalTime = 300; // 5 min
    let isPaused = true;
    
    let currentAudio = null;
    const soundFiles = {
        rain: 'sounds/calming-rain-257596.mp3',
        wind: 'sounds/desert-wind-2-350417.mp3',
        forest: 'sounds/forest-ambience-296528.mp3',
        ocean: 'sounds/ocean-waves-376898.mp3'
    };

    function breathingCycleText() {
        if (!breathingText) return;
        breathingText.textContent = "Breathe In";
        setTimeout(() => { breathingText.textContent = "Breathe Out"; }, 5000);
    }
    breathingCycleText();
    setInterval(breathingCycleText, 10000); 

    function displayTimeLeft(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${remainderSeconds.toString().padStart(2, '0')}`;
        timerDisplay.textContent = display;
    }

    function timer(seconds) {
        clearInterval(countdown);
        const now = Date.now();
        const then = now + seconds * 1000;
        displayTimeLeft(seconds);

        countdown = setInterval(() => {
            timeLeft = Math.round((then - Date.now()) / 1000);
            if (timeLeft < 0) {
                clearInterval(countdown);
                updateJourneyStats(totalTime / 60);
                startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
                isPaused = true;
                return;
            }
            displayTimeLeft(timeLeft);
        }, 1000);
    }
    
    function startTimer() {
        if (isPaused) {
            isPaused = false;
            timer(timeLeft || totalTime);
            startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        } else {
            isPaused = true;
            clearInterval(countdown);
            startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        }
    }

    function resetTimer() {
        isPaused = true;
        clearInterval(countdown);
        timeLeft = totalTime;
        displayTimeLeft(totalTime);
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    }

    function toggleSound(e) {
        const soundType = e.currentTarget.dataset.sound;
        const soundFile = soundFiles[soundType];
        const wasActive = e.currentTarget.classList.contains('active');


        if(currentAudio) {
            currentAudio.pause();
        }

        soundBtns.forEach(btn => btn.classList.remove('active'));
        if (!wasActive) {
            currentAudio = new Audio(soundFile);
            currentAudio.loop = true;
            currentAudio.play();
            e.currentTarget.classList.add('active');
        } else {
            currentAudio = null; 
        }
    }

    function updateJourneyStats(minutesToAdd) {
        let stats = JSON.parse(localStorage.getItem('mindfulnessStats')) || {
            totalMinutes: 0, completedSessions: 0, lastSessionDate: null, streak: 0
        };
        stats.totalMinutes = Math.round((stats.totalMinutes + minutesToAdd) * 10) / 10;
        stats.completedSessions += 1;
        
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (stats.lastSessionDate !== today) {
            stats.streak = (stats.lastSessionDate === yesterday) ? stats.streak + 1 : 1;
            stats.lastSessionDate = today;
        }

        localStorage.setItem('mindfulnessStats', JSON.stringify(stats));
        displayJourneyStats();
    }

    function displayJourneyStats() {
        let stats = JSON.parse(localStorage.getItem('mindfulnessStats')) || { totalMinutes: 0, completedSessions: 0, streak: 0 };
        document.getElementById('total-minutes').textContent = stats.totalMinutes;
        document.getElementById('completed-sessions').textContent = stats.completedSessions;
        
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if(stats.lastSessionDate !== today && stats.lastSessionDate !== yesterday) {
            stats.streak = 0; 
        }
        document.getElementById('current-streak').textContent = stats.streak;
    }

    startBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    presetBtns.forEach(btn => btn.addEventListener('click', (e) => {
        presetBtns.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        totalTime = parseInt(e.currentTarget.dataset.time);
        timeLeft = totalTime;
        resetTimer();
    }));

    soundBtns.forEach(btn => btn.addEventListener('click', toggleSound));

    timeLeft = totalTime;
    displayTimeLeft(totalTime);
    displayJourneyStats();
});