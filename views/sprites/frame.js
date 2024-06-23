// @ts-check
import { Color, Keyframe, Sprite } from "./renderer.js";
import { state } from "./state.js";

/**
 * @type {{ [key in Color['value']]: string }}
 */
export const COLOR_TO_HEX = {
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

/**
 * Prerenders a frame into a canvas element to be used for preview, playback, and editing.
 * @param {Keyframe} frame
 * @returns {HTMLCanvasElement}
 */
const makeFrame = (/** @type {Keyframe} */ frame) => {
  const width = frame.getWidth();
  const height = frame.getHeight();

  const $canvas = document.createElement('canvas');
  $canvas.width = width;
  $canvas.style.width = `${width}px`;
  $canvas.height = height;
  $canvas.style.height = `${height}px`;
  $canvas.style.imageRendering = 'pixelated';

  const context = /** @type {CanvasRenderingContext2D} */ ($canvas.getContext('2d'));
  context.imageSmoothingEnabled = false;
  context.fillStyle = COLOR_TO_HEX[Color.UNDEFINED_COLOR.value];

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const index = i + j * width;
      const color = frame.getContent().get(index);

      if (color && color.value > -1) {
        context.fillStyle = COLOR_TO_HEX[color.value];
        context.fillRect(i, j, 1, 1);
      }
    }
  }

  return $canvas
}

let cachedFrames = /** @type {HTMLCanvasElement[]} */ ([])

/**
* @param {Sprite} sprite
*/
const update = (sprite) => {
  cachedFrames = [];
  for (let i = 0; i < sprite.getFrameCount(); i++) {
    const frame = sprite.getFrame(i);
    const $canvas = makeFrame(frame);
    cachedFrames.push($canvas);
  }
}

export const frameManager = {
  init() {
    state.listen('sprite', update);
  },
  /**
   * @param {number} index
   * @returns {HTMLCanvasElement | undefined}
   */
  getFrame(/** @type {number} */ index) {
    const frame = cachedFrames[index]
    if (!frame) return;

    // Clone the canvas
    const newFrame = /** @type {HTMLCanvasElement} */ (frame.cloneNode());
    newFrame.getContext('2d')?.drawImage(frame, 0, 0);

    return newFrame;
  }
}