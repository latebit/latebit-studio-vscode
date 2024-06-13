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

      const $color = document.createElement('button');
      $color.classList.add('color');
      $color.style.backgroundColor = COLOR_TO_HEX[color.value];
      $color.addEventListener('click', this.selectCurrentColor.bind(this, color));
      this.$palette.appendChild($color);
    })

    state.listen('currentColor', this.highlightCurrentColor.bind(this));
  },
  selectCurrentColor(/** @type {Color} */ color, /** @type {Event} */ e) {
    e.preventDefault();
    state.setCurrentColor(color);
  },
  highlightCurrentColor(/** @type {Color} */ color) {
    const $selected = this.$palette.querySelector('.selected');
    if ($selected) {
      $selected.classList.remove('selected');
    }

    const $color = this.$palette.children[color.value];
    $color?.classList.add('selected');
  }
}