/**
 * Roll a dice based on type
 * @param {string} diceType - Type of dice (d4, d6, d8, d10, d12, d20)
 * @returns {number} - Random number between 1 and max value
 */
export const rollDice = (diceType = 'd6') => {
  const diceMap = {
    'd4': 4,
    'd6': 6,
    'd8': 8,
    'd10': 10,
    'd12': 12,
    'd20': 20
  };

  const maxValue = diceMap[diceType] || 6;
  return Math.floor(Math.random() * maxValue) + 1;
};

/**
 * Check if dice roll meets condition
 * @param {number} rollValue - The rolled value
 * @param {object} condition - Condition object with minValue and maxValue
 * @returns {boolean}
 */
export const checkDiceCondition = (rollValue, condition) => {
  return rollValue >= condition.minValue && rollValue <= condition.maxValue;
};
