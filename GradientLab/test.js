const assert = require('assert');
const {
  state,
  PRESET_GRADIENTS,
  normalizeHexColor,
  clampAngle,
  generateGradientCSS,
  generateFullCSSRule,
  getRandomHexColor
} = require('./script.js');

console.log('Running unit tests for GradientLab...');

// 1. Test normalizeHexColor
assert.strictEqual(normalizeHexColor('#4f46e5'), '#4f46e5');
assert.strictEqual(normalizeHexColor('4f46e5'), '#4f46e5');
assert.strictEqual(normalizeHexColor('#FF0844'), '#ff0844');
assert.strictEqual(normalizeHexColor('invalid'), null);
assert.strictEqual(normalizeHexColor('#1234'), null);

// 2. Test clampAngle
assert.strictEqual(clampAngle(90), 90);
assert.strictEqual(clampAngle(-10), 0);
assert.strictEqual(clampAngle(400), 360);
assert.strictEqual(clampAngle('180'), 180);
assert.strictEqual(clampAngle('abc'), 0);

// 3. Test generateGradientCSS and generateFullCSSRule
const css = generateGradientCSS('#112233', '#445566', 45);
assert.strictEqual(css, 'linear-gradient(45deg, #112233 0%, #445566 100%)');

const fullCSS = generateFullCSSRule('#112233', '#445566', 45);
assert.strictEqual(fullCSS, 'background: linear-gradient(45deg, #112233 0%, #445566 100%);');

// 4. Test getRandomHexColor
for (let i = 0; i < 50; i++) {
  const hex = getRandomHexColor();
  assert.strictEqual(normalizeHexColor(hex), hex);
}

// 5. Test preset library
assert.ok(PRESET_GRADIENTS.length > 0);
PRESET_GRADIENTS.forEach(p => {
  assert.ok(p.name);
  assert.strictEqual(normalizeHexColor(p.startColor), p.startColor.toLowerCase());
  assert.strictEqual(normalizeHexColor(p.endColor), p.endColor.toLowerCase());
  assert.ok(p.angle >= 0 && p.angle <= 360);
});

console.log('All unit tests passed successfully! ✅');
