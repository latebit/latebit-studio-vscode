// @ts-check
import { state } from "../state.js";
import { COLOR_TO_HEX, frameManager } from "../frame.js";
import { executeHostCommand, Command } from '../../ipc.js';
import { Color, Keyframe, Sprite, SpriteParser, setFrame } from "../renderer.js";
import { Tool } from "../constants.js";

const PIXEL_SIZE = 10;
const ALLOWED_ZOOM_VALUES = [0.5, 1, 2, 5]
/** @type {Sprite | null} */
let cachedSprite = null;

export const $editor = {
  $root:      /** @type {HTMLElement} */ (document.getElementById('editor')),
  $canvas:    /** @type {HTMLCanvasElement} */ (document.querySelector('#editor > .canvas-container > canvas')),
  $zoomIn:    /** @type {HTMLButtonElement} */ (document.querySelector('#editor > .zoom > #zoom-in')),
  $zoomOut:   /** @type {HTMLButtonElement} */ (document.querySelector('#editor > .zoom > #zoom-out')),
  $zoomReset: /** @type {HTMLButtonElement} */ (document.querySelector('#editor > .zoom > #zoom-reset')),
  init() {
    state.listen('frameIndex', this.update.bind(this));
    state.listen('sprite', this.update.bind(this));
    state.listen('zoom', (zoom) => {
      this.update();
      const index = ALLOWED_ZOOM_VALUES.indexOf(zoom);
      this.$zoomIn.disabled = index === (ALLOWED_ZOOM_VALUES.length - 1);
      this.$zoomOut.disabled = index == 0;
      this.$zoomReset.disabled = index === 1;
    });

    this.$zoomReset.disabled = true;
    this.$zoomIn.addEventListener('click', (e) => {
      e.preventDefault();
      let index = ALLOWED_ZOOM_VALUES.indexOf(state.getZoom());
      index = index === -1 ? 1 : Math.min(index + 1, ALLOWED_ZOOM_VALUES.length);
      state.setZoom(ALLOWED_ZOOM_VALUES[index]);
    })

    this.$zoomOut.addEventListener('click', (e) => {
      e.preventDefault();
      let index = ALLOWED_ZOOM_VALUES.indexOf(state.getZoom());
      index = index === -1 ? 1 : Math.max(index - 1, 0);
      state.setZoom(ALLOWED_ZOOM_VALUES[index]);
    })

    this.$zoomReset.addEventListener('click', (e) => {
      e.preventDefault();
      state.setZoom(1);
    })
  },
  update() {
    const frameIndex = state.getFrameIndex();
    const zoom = state.getZoom();
    const pixelSize = PIXEL_SIZE * zoom;

    const $frame = frameManager.getFrame(frameIndex);
    if (!$frame) return;

    $frame.style.width = `calc(${$frame.style.width} * ${pixelSize})`;
    $frame.style.height = `calc(${$frame.style.height} * ${pixelSize})`;

    let shouldUpdate = false;
    const init = (/** @type {PointerEvent} */ e) => {
      shouldUpdate = true;
      cachedSprite = state.getSprite();
      draw(e);
    }

    const draw = (/** @type {PointerEvent} */ e) => {
      if (!shouldUpdate) return;
      this.useTool(e);
    }

    const commit = () => {
      if (!shouldUpdate || !cachedSprite) return;
      shouldUpdate = false;
      state.setSprite(cachedSprite);
    }

    $frame.addEventListener('pointerdown', init);
    $frame.addEventListener('pointermove', draw);
    $frame.addEventListener('pointerup', commit);
    $frame.addEventListener('pointerout', commit);
    $frame.addEventListener('pointerleave', commit);

    this.$canvas.replaceWith($frame);
    this.$canvas = $frame;
  },
  useTool(/** @type {PointerEvent} */ e) {
    const canvas = /** @type {HTMLCanvasElement} */ (e.target);

    const zoom = state.getZoom();
    const pixelSize = PIXEL_SIZE * zoom;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);
    const toolType = state.getTool();

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    tools[toolType](x, y, ctx);
  }
}

/**
 * @typedef {(x: number, y: number, canvas: CanvasRenderingContext2D) => void} ToolCallback
 * @type {Record<import("../constants.js").ToolType, ToolCallback>}
 */
const tools = {
  [Tool.Pencil]: (x, y, ctx) => {
    const sprite = cachedSprite;
    if (!sprite) return;

    const color = state.getActiveColor();
    const index = x + y * sprite.getWidth();
    const frameIndex = state.getFrameIndex();
    const frame = sprite.getFrame(frameIndex);
    const content = frame.getContent()
    content.set(index, color);
    cachedSprite = setFrame(sprite, frameIndex, new Keyframe(frame.getWidth(), frame.getHeight(), content));
    frame.delete();

    // give visual feedback to the user
    ctx.fillStyle = COLOR_TO_HEX[color.value];
    ctx.fillRect(x, y, 1, 1);
  },
  [Tool.Eraser]: (x, y, ctx) => {
    const sprite = cachedSprite;
    if (!sprite) return;

    const index = x + y * sprite.getWidth();
    const frameIndex = state.getFrameIndex();
    const frame = sprite.getFrame(frameIndex);
    const content = frame.getContent()
    content.set(index, Color.UNDEFINED_COLOR);
    cachedSprite = setFrame(sprite, frameIndex, new Keyframe(frame.getWidth(), frame.getHeight(), content));
    frame.delete();

    // give visual feedback to the user
    ctx.clearRect(x, y, 1, 1);
  },
  [Tool.Picker]: (x, y) => {
    const sprite = cachedSprite;
    if (!sprite) return;

    const index = x + y * sprite.getWidth();
    const frameIndex = state.getFrameIndex();
    const frame = sprite.getFrame(frameIndex);
    const color = frame.getContent().get(index)
    if (color) {
      state.setActiveColor(color)
    }
  },
  [Tool.Fill]: (x, y, ctx) => {
    const sprite = cachedSprite;
    if (!sprite) return;

    const frameIndex = state.getFrameIndex();
    const frame = sprite.getFrame(frameIndex);
    const targetColor = frame.getContent().get(x + y * sprite.getWidth());
    const color = state.getActiveColor();
    const content = frame.getContent();

    const fill = (/** @type {number} */ x, /** @type {number} */ y) => {
      if (x < 0 || x >= sprite.getWidth() || y < 0 || y >= sprite.getHeight()) return;
      const index = x + y * sprite.getWidth();
      if (content.get(index) !== targetColor) return;
      content.set(index, color);
      ctx.fillStyle = COLOR_TO_HEX[color.value];
      ctx.fillRect(x, y, 1, 1);

      fill(x - 1, y);
      fill(x + 1, y);
      fill(x, y - 1);
      fill(x, y + 1);
    }

    fill(x, y);
    cachedSprite = setFrame(sprite, frameIndex, new Keyframe(frame.getWidth(), frame.getHeight(), content));
  }
}