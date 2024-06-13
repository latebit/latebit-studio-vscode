// @ts-check
import { state } from "../state.js";
import { COLOR_TO_HEX, frameManager } from "../frame.js";
import { executeHostCommand, Command } from '../../ipc.js';
import { Frame, SpriteParser } from "../renderer.js";

const PIXEL_SIZE = 10;
let cachedSprite = state.getSprite();

export const $editor = {
  $root: /** @type {HTMLElement} */ (document.getElementById('editor')),
  init() {
    state.listen('currentFrame', this.update.bind(this));
    state.listen('sprite', (sprite) => {
      this.update();
      executeHostCommand(Command.UpdateDocumentText, SpriteParser.toString(sprite));
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
    let shouldUpdate = false;

    $frame.addEventListener('mousedown', (e) => {
      shouldUpdate = true;
      cachedSprite = state.getSprite();
      this.usePencil(e);
    })
    $frame.addEventListener('mousemove', (e) => {
      if (!shouldUpdate) return;
      this.usePencil(e)
    });
    $frame.addEventListener('mouseup', () => {
      shouldUpdate = false;
      state.setSprite(cachedSprite);
    })

    this.$root.innerHTML = '';
    this.$root.appendChild($frame);
  },
  usePencil(/** @type {MouseEvent} */ e) {
    const canvas = /** @type {HTMLCanvasElement} */ (e.target);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const zoom = state.getZoom();
    const pixelSize = PIXEL_SIZE * zoom;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);

    const color = state.getCurrentColor();

    // update sprite in memory, the updates will be commited to the document when the mouse is released
    const sprite = cachedSprite;
    const index = x + y * sprite.getWidth();
    const frameIndex = state.getCurrentFrame();
    const frame = sprite.getFrame(frameIndex);
    const content = frame.getContent()
    content.set(index, color);
    sprite.setFrame(frameIndex, new Frame(frame.getWidth(), frame.getHeight(), content));
    frame.delete();

    // give visual feedback to the user
    ctx.fillStyle = COLOR_TO_HEX[color.value];
    ctx.fillRect(x, y, 1, 1);
  }
}