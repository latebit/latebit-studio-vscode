// @ts-check
/**
 * @typedef {import('../renderer.js').Sprite} Sprite
 */
import { Color } from "../renderer.js";
import { state } from "../state.js";

const COLOR_TO_HEX = {
  [Color.UNDEFINED_COLOR.value]: 'rgba(0, 0, 0, 0)',
  [Color.BLACK.value]: 'rgb(0, 0, 0)',
  [Color.DARK_BLUE.value]: 'rgb(29, 43, 83)',
  [Color.DARK_PURPLE.value]: 'rgb(126, 37, 83)',
  [Color.DARK_GREEN.value]: 'rgb(0, 135, 81)',
  [Color.BROWN.value]: 'rgb(171, 82, 54)',
  [Color.DARK_GRAY.value]: 'rgb(95, 87, 79)',
  [Color.LIGHT_GRAY.value]: 'rgb(194, 195, 199)',
  [Color.WHITE.value]: 'rgb(255, 241, 232)',
  [Color.RED.value]: 'rgb(255, 0, 77)',
  [Color.ORANGE.value]: 'rgb(255, 163, 0)',
  [Color.YELLOW.value]: 'rgb(255, 236, 39)',
  [Color.GREEN.value]: 'rgb(0, 228, 54)',
  [Color.BLUE.value]: 'rgb(41, 173, 255)',
  [Color.INDIGO.value]: 'rgb(131, 118, 156)',
  [Color.PINK.value]: 'rgb(255, 119, 168)',
  [Color.PEACH.value]: 'rgb(255, 204, 170)',
};

const PIXEL_SIZE = 10;

export const $editor = {
  /** @type {!HTMLElement} */
  // @ts-expect-error
  $root: document.getElementById('editor'),
  init() {
    state.listen('sprite', this.update.bind(this));
  },
  /**
   * @param {Sprite} sprite
   */
  update(sprite) {
    const frameIndex = 0;
    const zoom = state.getZoom();
    const pixelSize = PIXEL_SIZE * zoom;

    const frame = sprite.getFrame(frameIndex);
    const width = frame.getWidth();
    const height = frame.getHeight();

    const $canvas = document.createElement('canvas');
    $canvas.width = width * pixelSize;
    $canvas.height = height * pixelSize;

    const context = /** @type {CanvasRenderingContext2D} */ ($canvas.getContext('2d'));
    context.imageSmoothingEnabled = false;
    context.scale(pixelSize, pixelSize);
    context.fillStyle = COLOR_TO_HEX[Color.WHITE.value];

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const index = i + j * width;
        const { value: color } = frame.getContent().get(index);
        context.fillStyle = COLOR_TO_HEX[color];
        context.fillRect(i, j, 1, 1);
      }
    }

    this.$root.innerHTML = '';
    this.$root.appendChild($canvas);
  }
}