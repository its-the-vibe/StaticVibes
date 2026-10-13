/**
 * GradientLab - CSS Gradient Generator Core Logic & State Management
 */

// Initial App State
const state = {
  startColor: '#4f46e5',
  endColor: '#06b6d4',
  angle: 90
};

// Preset Gradient Library
const PRESET_GRADIENTS = [
  { name: 'Ocean Blue', startColor: '#2b5876', endColor: '#4e4376', angle: 135 },
  { name: 'Sunset Glow', startColor: '#ff0844', endColor: '#ffb199', angle: 90 },
  { name: 'Neon City', startColor: '#833ab4', endColor: '#fd1d1d', angle: 45 },
  { name: 'Emerald', startColor: '#0ba360', endColor: '#3cba92', angle: 120 },
  { name: 'Cosmic Purple', startColor: '#6a11cb', endColor: '#2575fc', angle: 90 },
  { name: 'Warm Amber', startColor: '#f83600', endColor: '#f9d423', angle: 60 },
  { name: 'Pastel Dream', startColor: '#ff9a9e', endColor: '#fecfef', angle: 90 },
  { name: 'Cyberpunk', startColor: '#f107a3', endColor: '#7b2cbf', angle: 180 }
];

/**
 * Validates whether a string is a valid 6-character hex color (e.g., "#4F46E5" or "4F46E5")
 * @param {string} hex
 * @returns {string|null} Formatted hex string with leading # or null if invalid
 */
function normalizeHexColor(hex) {
  if (!hex) return null;
  let cleanHex = hex.trim();
  if (cleanHex.startsWith('#')) {
    cleanHex = cleanHex.slice(1);
  }
  if (/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return `#${cleanHex.toLowerCase()}`;
  }
  return null;
}

/**
 * Clamps an angle value to range 0-360
 * @param {number|string} val
 * @returns {number}
 */
function clampAngle(val) {
  let num = parseInt(val, 10);
  if (isNaN(num)) return 0;
  if (num < 0) return 0;
  if (num > 360) return 360;
  return num;
}

/**
 * Generates the CSS linear-gradient string
 * @param {string} startColor
 * @param {string} endColor
 * @param {number} angle
 * @returns {string} Standard CSS gradient rule
 */
function generateGradientCSS(startColor, endColor, angle) {
  return `linear-gradient(${angle}deg, ${startColor} 0%, ${endColor} 100%)`;
}

/**
 * Generates full background property CSS line
 * @param {string} startColor
 * @param {string} endColor
 * @param {number} angle
 * @returns {string}
 */
function generateFullCSSRule(startColor, endColor, angle) {
  return `background: ${generateGradientCSS(startColor, endColor, angle)};`;
}

/**
 * Generates a random valid hex color string
 * @returns {string}
 */
function getRandomHexColor() {
  const letters = '0123456789abcdef';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * DOM Elements & UI Initialization (Browser Environment)
 */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // DOM Cache
    const gradientPreview = document.getElementById('gradient-preview');
    const previewAngleBadge = document.getElementById('preview-angle-badge');
    const cssCodeOutput = document.getElementById('css-code-output');

    const startColorPicker = document.getElementById('start-color-picker');
    const startColorHex = document.getElementById('start-color-hex');
    const endColorPicker = document.getElementById('end-color-picker');
    const endColorHex = document.getElementById('end-color-hex');

    const angleSlider = document.getElementById('angle-slider');
    const angleInput = document.getElementById('angle-input');
    const presetAngleBtns = document.querySelectorAll('.preset-angle-btn');

    const randomBtn = document.getElementById('random-btn');
    const swapBtn = document.getElementById('swap-btn');
    const copyBtn = document.getElementById('copy-btn');
    const copyText = document.getElementById('copy-text');
    const copyIcon = document.getElementById('copy-icon');
    const copyToast = document.getElementById('copy-toast');
    const presetsGrid = document.getElementById('presets-grid');

    let toastTimeout = null;

    /**
     * Updates DOM preview and code output from current state
     */
    function updateUI() {
      const gradientStyle = generateGradientCSS(state.startColor, state.endColor, state.angle);
      const cssRule = generateFullCSSRule(state.startColor, state.endColor, state.angle);

      gradientPreview.style.background = gradientStyle;
      previewAngleBadge.textContent = `${state.angle}°`;
      cssCodeOutput.textContent = cssRule;

      // Update color controls inputs if not already matching
      if (startColorPicker.value !== state.startColor) startColorPicker.value = state.startColor;
      if (startColorHex.value !== state.startColor) startColorHex.value = state.startColor;
      if (endColorPicker.value !== state.endColor) endColorPicker.value = state.endColor;
      if (endColorHex.value !== state.endColor) endColorHex.value = state.endColor;

      // Update angle controls inputs
      if (parseInt(angleSlider.value, 10) !== state.angle) angleSlider.value = state.angle;
      if (parseInt(angleInput.value, 10) !== state.angle) angleInput.value = state.angle;

      // Update active state on preset angle buttons
      presetAngleBtns.forEach(btn => {
        const btnAngle = parseInt(btn.dataset.angle, 10);
        if (btnAngle === state.angle) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    /**
     * Renders preset gradient cards into the grid
     */
    function renderPresets() {
      if (!presetsGrid) return;
      presetsGrid.innerHTML = '';

      PRESET_GRADIENTS.forEach(preset => {
        const item = document.createElement('div');
        item.className = 'preset-item';
        item.title = `Apply ${preset.name} (${preset.startColor} -> ${preset.endColor}, ${preset.angle}°)`;

        const gradientString = generateGradientCSS(preset.startColor, preset.endColor, preset.angle);

        item.innerHTML = `
          <div class="preset-preview" style="background: ${gradientString}"></div>
          <div class="preset-info">
            <div class="preset-name">${preset.name}</div>
          </div>
        `;

        item.addEventListener('click', () => {
          state.startColor = preset.startColor;
          state.endColor = preset.endColor;
          state.angle = preset.angle;
          updateUI();
        });

        presetsGrid.appendChild(item);
      });
    }

    // --- Color Event Listeners ---
    startColorPicker.addEventListener('input', (e) => {
      state.startColor = e.target.value;
      startColorHex.value = e.target.value;
      updateUI();
    });

    startColorHex.addEventListener('input', (e) => {
      const valid = normalizeHexColor(e.target.value);
      if (valid) {
        state.startColor = valid;
        startColorPicker.value = valid;
        updateUI();
      }
    });

    endColorPicker.addEventListener('input', (e) => {
      state.endColor = e.target.value;
      endColorHex.value = e.target.value;
      updateUI();
    });

    endColorHex.addEventListener('input', (e) => {
      const valid = normalizeHexColor(e.target.value);
      if (valid) {
        state.endColor = valid;
        endColorPicker.value = valid;
        updateUI();
      }
    });

    // --- Angle Event Listeners ---
    angleSlider.addEventListener('input', (e) => {
      state.angle = clampAngle(e.target.value);
      updateUI();
    });

    angleInput.addEventListener('input', (e) => {
      if (e.target.value === '') return;
      state.angle = clampAngle(e.target.value);
      updateUI();
    });

    angleInput.addEventListener('blur', (e) => {
      state.angle = clampAngle(e.target.value);
      updateUI();
    });

    presetAngleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const angle = parseInt(btn.dataset.angle, 10);
        state.angle = clampAngle(angle);
        updateUI();
      });
    });

    // --- Action Button Event Listeners ---
    randomBtn.addEventListener('click', () => {
      state.startColor = getRandomHexColor();
      state.endColor = getRandomHexColor();
      state.angle = Math.floor(Math.random() * 361);
      updateUI();
    });

    swapBtn.addEventListener('click', () => {
      const temp = state.startColor;
      state.startColor = state.endColor;
      state.endColor = temp;
      updateUI();
    });

    // --- Copy to Clipboard Event Listener ---
    copyBtn.addEventListener('click', async () => {
      const cssRule = generateFullCSSRule(state.startColor, state.endColor, state.angle);
      let success = false;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(cssRule);
          success = true;
        } catch (err) {
          console.warn('Clipboard API failed, falling back:', err);
        }
      }

      if (!success) {
        // Fallback for environments where navigator.clipboard is restricted
        try {
          const textArea = document.createElement('textarea');
          textArea.value = cssRule;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          success = document.execCommand('copy');
          document.body.removeChild(textArea);
        } catch (err) {
          console.error('Fallback copy failed:', err);
        }
      }

      if (success) {
        copyText.textContent = 'Copied!';
        copyIcon.textContent = '✅';
        copyToast.classList.remove('hidden');

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
          copyText.textContent = 'Copy CSS';
          copyIcon.textContent = '📋';
          copyToast.classList.add('hidden');
        }, 2000);
      }
    });

    // Initialize UI on load
    renderPresets();
    updateUI();
  });
}

// Export for Node.js testing environments if module exists
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    state,
    PRESET_GRADIENTS,
    normalizeHexColor,
    clampAngle,
    generateGradientCSS,
    generateFullCSSRule,
    getRandomHexColor
  };
}
