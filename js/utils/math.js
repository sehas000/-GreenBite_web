
/**
  @param {object} data 
  @param {number} data.weight 
  @param {number} data.height 
  @param {number} data.age 
  @param {string} data.gender 
  @returns {number} 
*/
export function calculateBMR(data) {
    const { weight, height, age, gender } = data;
    if (gender === 'male') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
}

/**
  @param {number} bmr 
  @param {number} activityFactor 
  @returns {number} 
*/

export function calculateTDEE(bmr, activityFactor) {
    return bmr * activityFactor;
}


/**
  @param {number} tdee 
  @returns {object} 
*/
export function calculateMacros(tdee) {
    const carbs = (tdee * 0.50) / 4;
    const protein = (tdee * 0.20) / 4;
    const fat = (tdee * 0.30) / 9;
    return { carbs, protein, fat };
}