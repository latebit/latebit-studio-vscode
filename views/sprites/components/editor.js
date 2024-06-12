// @ts-check
/**
 * @typedef {import('../renderer.js').Sprite} Sprite
 */
import { state } from "../state.js";
import { frameManager } from "../frame.js";

const PIXEL_SIZE = 10;

export const $editor = {
  $root: /** @type {!HTMLElement} */ (document.getElementById('editor')),
  init() {
    state.listen('currentFrame', this.update.bind(this));
    const stop = state.listen('sprite', () => {
      this.update();
      stop();
    });
  },
  update() {
    const frameIndex = state.getCurrentFrame();
    const zoom = state.getZoom();
    const pixelSize = PIXEL_SIZE * zoom;

    const $frame = frameManager.getFrame(frameIndex);
    if (!$frame) return;

    $frame.style.width = `calc(${$frame.style.width} * ${pixelSize})`;
    $frame.style.height = `calc(${$frame.style.height} * ${pixelSize})`;

    this.$root.innerHTML = '';
    this.$root.appendChild($frame);
  }
}