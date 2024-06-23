// @ts-check
import { Tool } from '../constants.js';
import { COLOR_TO_HEX } from '../frame.js';
import { Color } from '../renderer.js';
import { state } from '../state.js';

export const $tools = {
  $root:    /** @type {HTMLElement} */ (document.querySelector('#tools')),
  $palette: /** @type {HTMLElement} */ (document.querySelector('#tools > #palette')),
  $toolbox: /** @type {HTMLElement} */ (document.querySelector('#tools > #toolbox')),
  init() {
    this.renderPalette();

    this.$palette.addEventListener('change', (e) => {
      const $color = /** @type {HTMLInputElement} */ (e.target);
      const color = Object.values(Color).find((color) => color.value === parseInt(($color.value)));

      if (!color) return;
      state.setActiveColor(color);
    })

    this.$toolbox.addEventListener('change', (e) => {
      const $tool = /** @type {HTMLInputElement} */ (e.target);

      // @ts-expect-error This is a poor man's type guard
      if (Object.values(Tool).indexOf($tool.value) === -1) return;
      const tool = /** @type {import('../constants.js').ToolType} */ ($tool.value);

      state.setTool(tool);
    })

    state.listen('activeColor', (/** @type {Color} */ color) => {
      for (const $color of this.$palette.childNodes) {
        if (!($color instanceof HTMLInputElement)) continue;
        $color.checked = ($color.value === color.value.toString());
      }
    })
  },
  renderPalette() {
    Object.values(Color).forEach((color) => {
      if (color.value === Color.UNDEFINED_COLOR.value || typeof color.value != 'number') return;

      const $color = document.createElement('input');
      $color.type = 'radio';
      $color.classList.add('color');
      $color.name = 'color';
      $color.checked = color === state.getActiveColor();
      $color.style.backgroundColor = COLOR_TO_HEX[color.value];
      $color.value = color.value.toString();
      this.$palette.appendChild($color);
    });
  }
}