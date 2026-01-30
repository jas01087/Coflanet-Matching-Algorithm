const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'user_coffee_match.json');

const tasteScale = {
  low: 1.5,
  mid: 3.0,
  high: 4.5,
};

const preferenceToCategory = {
  fruity: 'Fruity',
  floral: 'Floral',
  nutty_cocoa: 'Nutty/Cocoa',
  roasted: 'Roasted',
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const calculateTasteScore = (userTaste, coffeeTaste) => {
  const dimensions = Object.keys(userTaste);
  const scores = dimensions.map((dimension) => {
    const target = tasteScale[userTaste[dimension]] ?? tasteScale.mid;
    const coffeeValue = coffeeTaste[dimension] ?? tasteScale.mid;
    const diff = Math.abs(target - coffeeValue);
    return clamp(1 - diff / 4, 0, 1);
  });

  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
};

const calculateFlavorScore = (userFlavor, coffeeCategories) => {
  const categories = new Set(coffeeCategories);
  const scores = Object.entries(preferenceToCategory).map(([key, category]) => {
    const preference = userFlavor[key];
    const hasCategory = categories.has(category);

    if (preference === true && hasCategory) return 1;
    if (preference === true && !hasCategory) return 0;
    if (preference === false && hasCategory) return 0;
    return 1;
  });

  const total = scores.reduce((sum, score) => sum + score, 0);
  return total / scores.length;
};

const formatScore = (value) => Number(value.toFixed(4));

const generateMatches = ({ users, coffees }) => {
  const matchResults = {};

  users.forEach((user) => {
    const results = coffees.map((coffee) => {
      const tasteMatchRatio = calculateTasteScore(
        user.taste_preference,
        coffee.taste_profile,
      );
      const flavorMatchRatio = calculateFlavorScore(
        user.flavor_preference,
        coffee.flavor_profile.categories,
      );
      const totalScore = tasteMatchRatio * 0.6 + flavorMatchRatio * 0.4;

      return {
        coffee_id: coffee.id,
        coffee_name: coffee.name,
        taste_match_ratio: formatScore(tasteMatchRatio),
        flavor_match_ratio: formatScore(flavorMatchRatio),
        total_score: formatScore(totalScore),
      };
    });

    matchResults[user.user_id] = results.sort(
      (a, b) => b.total_score - a.total_score,
    );
  });

  return matchResults;
};

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
const matchResults = generateMatches(data);

const output = {
  ...data,
  match_results: matchResults,
};

fs.writeFileSync(DATA_PATH, JSON.stringify(output, null, 2));
console.log('Match results updated.');
