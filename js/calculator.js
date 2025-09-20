import { calculateBMR, calculateTDEE, calculateMacros } from './utils/math.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calorie-form');
    const ageInput = document.getElementById('age');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const activityInput = document.getElementById('activity');
    const allTextInputs = [ageInput, heightInput, weightInput];
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');


    const resultsSection = document.getElementById('results-section');
    const bmrResultEl = document.getElementById('bmr-result');
    const tdeeResultEl = document.getElementById('tdee-result');
    const carbsBar = document.getElementById('carbs-bar');
    const proteinBar = document.getElementById('protein-bar');
    const fatBar = document.getElementById('fat-bar');
    const carbsGramsEl = document.getElementById('carbs-grams');
    const proteinGramsEl = document.getElementById('protein-grams');
    const fatGramsEl = document.getElementById('fat-grams');


    const validationRules = {
        age: { min: 13, max: 100, message: 'Enter an age between 13 and 100.' },
        height: { min: 80, max: 250, message: 'Enter a height between 80 and 250 cm.' },
        weight: { min: 30, max: 300, message: 'Enter a weight between 30 and 300 kg.' },
    };

    function validateInput(input) {
        const rule = validationRules[input.name];
        const value = parseFloat(input.value);
        const errorEl = input.nextElementSibling;

        if (!input.value) {
            showError(input, errorEl, 'This field is required.');
            return false;
        }
        if (rule && (value < rule.min || value > rule.max)) {
            showError(input, errorEl, rule.message);
            return false;
        }
        clearError(input, errorEl);
        return true;
    }

    function validateSelect(select) {
        const errorEl = select.nextElementSibling;
        if (!select.value) {
            showError(select, errorEl, 'Please select an option.');
            return false;
        }
        clearError(select, errorEl);
        return true;
    }

    function validateGender() {
        const selectedGender = document.querySelector('input[name="gender"]:checked');
        const errorEl = document.querySelector('.gender-options').nextElementSibling;
        if (!selectedGender) {
            errorEl.textContent = 'Please select a gender.';
            return false;
        }
        errorEl.textContent = '';
        return true;
    }

    function showError(input, errorEl, message) {
        input.classList.add('invalid');
        errorEl.textContent = message;
    }

    function clearError(input, errorEl) {
        input.classList.remove('invalid');
        if (errorEl) errorEl.textContent = '';
    }

    function checkFormValidity() {
        const isAgeValid = validateInput(ageInput);
        const isHeightValid = validateInput(heightInput);
        const isWeightValid = validateInput(weightInput);
        const isActivityValid = validateSelect(activityInput);
        const isGenderValid = validateGender();

        calculateBtn.disabled = !(isAgeValid && isHeightValid && isWeightValid && isActivityValid && isGenderValid);
    }

    allTextInputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
    });
    activityInput.addEventListener('change', checkFormValidity);
    genderInputs.forEach(radio => {
        radio.addEventListener('change', checkFormValidity);
    });
    
    form.addEventListener('submit', handleCalculate);
    resetBtn.addEventListener('click', handleReset);
    saveBtn.addEventListener('click', handleSave);


    function handleCalculate(event) {
        event.preventDefault();
        if (calculateBtn.disabled) return;

        const inputs = getFormInputs();
        const bmr = calculateBMR(inputs);
        const tdee = calculateTDEE(bmr, inputs.activityFactor);
        const macros = calculateMacros(tdee);

        displayResults({ bmr, tdee, macros });
        saveBtn.classList.remove('hidden');
    }

    function handleReset() {
        form.reset();
        allTextInputs.forEach(input => clearError(input, input.nextElementSibling));
        clearError(activityInput, activityInput.nextElementSibling); 
        document.querySelector('.gender-options').nextElementSibling.textContent = '';
        saveBtn.classList.add('hidden');
        calculateBtn.disabled = true;
        localStorage.removeItem('gb_calc_inputs');
        localStorage.removeItem('gb_calc_results');
    }

    function handleSave() {
        const inputs = getFormInputs();
        const results = {
            bmr: parseFloat(bmrResultEl.textContent),
            tdee: parseFloat(tdeeResultEl.textContent),
            macros: {
                carbs: parseFloat(carbsGramsEl.textContent),
                protein: parseFloat(proteinGramsEl.textContent),
                fat: parseFloat(fatGramsEl.textContent),
            }
        };
        localStorage.setItem('gb_calc_inputs', JSON.stringify(inputs));
        localStorage.setItem('gb_calc_results', JSON.stringify(results));
        alert('Your calculation results have been saved!');
    }

    function getFormInputs() {
        return {
            age: parseInt(ageInput.value),
            gender: document.querySelector('input[name="gender"]:checked').value,
            height: parseInt(heightInput.value),
            weight: parseInt(weightInput.value),
            activityFactor: parseFloat(activityInput.value),
        };
    }
    function displayResults({ bmr, tdee, macros }) {
        resultsSection.classList.remove('hidden');

        animateCounter(bmrResultEl, Math.round(bmr));
        animateCounter(tdeeResultEl, Math.round(tdee));

        carbsGramsEl.textContent = `${macros.carbs.toFixed(1)}g`;
        proteinGramsEl.textContent = `${macros.protein.toFixed(1)}g`;
        fatGramsEl.textContent = `${macros.fat.toFixed(1)}g`;

        setTimeout(() => {
            carbsBar.style.width = '50%';
            proteinBar.style.width = '20%';
            fatBar.style.width = '30%';
        }, 100);

        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    function animateCounter(element, targetValue) {
        let currentValue = 0;
        const duration = 1500;
        const stepTime = Math.max(1, Math.floor(duration / targetValue));
        
        if (targetValue === 0) {
            element.textContent = 0;
            return;
        }

        const increment = Math.ceil(targetValue / (duration / stepTime));

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                element.textContent = targetValue;
                clearInterval(timer);
            } else {
                element.textContent = currentValue;
            }
        }, stepTime);
    }
    function loadSavedData() {
        const savedInputs = JSON.parse(localStorage.getItem('gb_calc_inputs'));
        const savedResults = JSON.parse(localStorage.getItem('gb_calc_results'));

        if (savedInputs) {
            ageInput.value = savedInputs.age;
            document.querySelector(`input[name="gender"][value="${savedInputs.gender}"]`).checked = true;
            heightInput.value = savedInputs.height;
            weightInput.value = savedInputs.weight;
            activityInput.value = savedInputs.activityFactor;
            checkFormValidity();
        }

        if (savedResults) {
            displayResults({
                bmr: savedResults.bmr,
                tdee: savedResults.tdee,
                macros: {
                    carbs: savedResults.macros.carbs,
                    protein: savedResults.macros.protein,
                    fat: savedResults.macros.fat
                }
            });
            saveBtn.classList.remove('hidden');
        }
    }

    loadSavedData();
    checkFormValidity(); 
});

