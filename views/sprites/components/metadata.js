// @ts-check
import { Sprite } from '../renderer.js';
import { state } from '../state.js';

export const $metadata = {
  $frames: /** @type {!HTMLInputElement} */ (document.getElementById('frames')),
  $width: /** @type {!HTMLInputElement} */ (document.getElementById('width')),
  $height: /** @type {!HTMLInputElement} */ (document.getElementById('height')),
  $slowdown: /** @type {!HTMLInputElement} */ (document.getElementById('slowdown')),
  init() {
    state.listen('sprite', this.update.bind(this));
  },
  /**
   * @param {Sprite} sprite
   */
  update(sprite) {
    this.$frames.value = sprite.getFrameCount().toString();
    this.$frames.defaultValue = sprite.getFrameCount().toString();
    this.$width.value = sprite.getWidth().toString();
    this.$width.defaultValue = sprite.getWidth().toString();
    this.$height.value = sprite.getHeight().toString();
    this.$height.defaultValue = sprite.getHeight().toString();
    this.$slowdown.value = sprite.getSlowdown().toString();
    this.$slowdown.defaultValue = sprite.getSlowdown().toString();
  }
}