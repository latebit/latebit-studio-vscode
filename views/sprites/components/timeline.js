// @ts-check
import { Sprite } from '../renderer.js'
import { state } from '../state.js'
import { frameManager } from '../frame.js'

export const $timeline = {
  $root: /** @type {HTMLElement} */ (document.getElementById('timeline')),
  init() {
    state.listen('sprite', this.update.bind(this))
    state.listen('frameIndex', this.highlight.bind(this))
  },
  highlight(/** @type {number} */ frame) {
    Array.from(this.$root.children).forEach((child, index) => {
      if (index == frame) {
        child.classList.add('selected');
      } else {
        child.classList.remove('selected');
      }
    });
  },
  update(/** @type {Sprite} */ sprite) {
    this.$root.innerHTML = '';
    const count = sprite.getFrameCount();
    for (let i = 0; i < count; i++) {
      const $frame = document.createElement('div');
      $frame.classList.add('frame');
      $frame.setAttribute("data-index", i.toString());
      $frame.addEventListener('click', (e) => {
        e.preventDefault();
        state.setFrameIndex(i);
      })

      const $canvas = frameManager.getFrame(i);
      if (!$canvas) continue;

      $canvas.style.height = '80px';
      $canvas.style.width = 'unset';

      const $label = document.createElement('span');
      $label.innerText = `${i + 1}`

      $frame.appendChild($canvas)
      $frame.appendChild($label)
      this.$root.appendChild($frame);
    }
  }
}