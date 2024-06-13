// @ts-check
import { COLOR_TO_HEX } from '../frame.js';
import { Color } from '../renderer.js';
import { state } from '../state.js';

export const $tools = {
  $root:    /** @type {HTMLElement} */ (document.querySelector('#tools')),
  $palette: /** @type {HTMLElement} */ (document.querySelector('#tools > #palette')),
  $toolbox: /** @type {HTMLElement} */ (document.querySelector('#tools > #toolbox')),
  init() {
    Object.values(Color).forEach((color) => {
      if (color.value === Color.UNDEFINED_COLOR.value || typeof color.value != 'number') return;

      const $color = document.createElement('input');
      $color.type = 'radio';
      $color.classList.add('color');
      $color.name = 'color';
      $color.checked = color === state.getCurrentColor();
      $color.style.backgroundColor = COLOR_TO_HEX[color.value];
      $color.value = color.value.toString();
      this.$palette.appendChild($color);
    })

    this.$palette.addEventListener('change', (e) => {
      const $color = /** @type {HTMLInputElement} */ (e.target);
      const color = Object.values(Color).find((color) => color.value === parseInt(($color.value)));

      if (!color) return;
      state.setCurrentColor(color);
    })
  }
}