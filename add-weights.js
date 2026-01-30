const fs = require('fs');
const path = require('path');

// subCategory 인기 가중치 (커피 맛에서 자주 언급되는 순 → 높은 가중치)
const subCategoryWeight = {
  'Berry': 1.25,
  'Citrus fruit': 1.25,
  'Cocoa': 1.25,
  'Nutty': 1.25,
  'Brown sugar': 1.25,
  'Roasted': 1.25,
  'Floral': 1.15,
  'Tobacco': 1.15,
  'Brown spice': 1.15,
  'Vanilla': 1.15,
  'Sweet Aromatics': 1.15,
  'Nutty/Cocoa': 1.15,
  'Fruity': 1.05,
  'Other fruit': 1.05,
  'Spices': 1.05,
  'Green/Vegetative': 1.05,
  'Sweet': 1.05,
  'Dried fruit': 1.0,
  'Sour/Fermented': 1.0,
  'Alcohol/Fermented': 1.0,
  'Cereal': 1.0,
  'Burnt': 1.0,
  'Vanillin': 1.0,
  'Overall sweet': 1.0,
  'Black Tea': 1.0,
  'Sour': 0.9,
  'Olive oil': 0.9,
  'Raw': 0.9,
  'Beany': 0.9,
  'Papery/Musty': 0.9,
  'Chemical': 0.9,
  'Other': 0.9,
  'Pungent': 0.85,
  'Pepper': 0.85,
  'Pipe tobacco': 0.85,
};

const filePath = path.join(__dirname, 'coffee_flavor_full.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const out = data.map((item) => ({
  ...item,
  subCategoryWeight: subCategoryWeight[item.subCategory] ?? 1.0,
}));

fs.writeFileSync(filePath, JSON.stringify(out, null, 2), 'utf8');
console.log('subCategoryWeight 적용 완료. 항목 수:', out.length);
