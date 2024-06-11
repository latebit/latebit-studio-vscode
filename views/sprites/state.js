// @ts-check
/**
 * @typedef {import('./renderer').Sprite} Sprite
 */
import { isSameSprite } from './renderer.js';

/**
 * @type {Object} Listeners
 * @param {((sprite: Sprite) => void)[]} sprite
 */
const listeners = {
  sprite: [],
  zoom: [],
}

/**
 * @type {Object} State 
 * @param {Sprite} sprite
 * @param {number} zoom
 */
const store = {
  sprite: null,
  zoom: 1,
}

export const state = {
  /**
   * @method setSprite
   * @param {Sprite} sprite
   */
  setSprite(sprite) {
    if (!sprite || (!!sprite && !!state.sprite && isSameSprite(sprite, state.sprite))) return;

    store.sprite = sprite;
    listeners.sprite?.forEach(callback => callback(sprite));
  },

  /**
   * @method getSprite
   * @returns {readonly Sprite | null}
   */
  getSprite() {
    return store.sprite;
  },

  /**
   * @method getZoom
   * @returns {readonly number}
   */
  getZoom() {
    return store.zoom;
  },

  /**
   * @param {"sprite"} property
   * @param {(arg: T) => void} callback
   */
  listen(property, callback) {
    listeners[property].push(callback);
  }
}