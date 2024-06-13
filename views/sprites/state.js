// @ts-check
import { Color, isSameSprite, Sprite } from './renderer.js';

/**
 * @template T
 * @typedef {(value: T) => void} ListenerCallback<T>
*/

/**
 * @typedef {Object} Store 
 * @property {Sprite} sprite
 * @property {number} zoom
 * @property {number} currentFrame
 * @property {Color} currentColor
 */

/**
 * @type {Store} store
 */
const store = {
  sprite: new Sprite("", 0, 0, 0, 0),
  zoom: 1,
  currentFrame: 0,
  currentColor: Color.BLACK,
}

/**
 * @typedef {Object} Listeners
 * @property {ListenerCallback<Store['sprite']>[]} sprite
 * @property {ListenerCallback<Store['zoom']>[]} zoom
 * @property {ListenerCallback<Store['currentFrame']>[]} currentFrame
 * @property {ListenerCallback<Store['currentColor']>[]} currentColor
 */

/** @type {Listeners} */
const listeners = {
  sprite: [],
  zoom: [],
  currentFrame: [],
  currentColor: [],
}


const triggerAllCallbacks = (callbacks, arg) => {
  callbacks?.forEach(callback => {
    try {
      callback(arg)
    } catch (e) {
      // noop
    }
  });
}

export const state = {
  /**
   * @method setSprite
   * @param {Sprite} sprite
   */
  setSprite(sprite) {
    if (!sprite || (!!sprite && !!state.sprite && isSameSprite(sprite, state.sprite))) return;

    store.sprite = sprite;
    triggerAllCallbacks(listeners.sprite, sprite);
  },

  /**
   * @method getSprite
   * @returns {readonly Store['sprite']}
   */
  getSprite() {
    return store.sprite;
  },

  /**
   * @method getZoom
   * @returns {readonly Store['zoom']}
   */
  getZoom() {
    return store.zoom;
  },

  /**
   * @method setCurrentFrame
   * @param {number} frame
   */
  setCurrentFrame(frame) {
    store.currentFrame = frame;
    triggerAllCallbacks(listeners.currentFrame, frame);
  },

  /**
   * @method getCurrentFrame
   * @returns {readonly Store['currentFrame']}
   */
  getCurrentFrame() {
    return store.currentFrame;
  },

  /**
   * @method setCurrentColor
   * @param {Color} color
   */
  setCurrentColor(color) {
    store.currentColor = color;
    triggerAllCallbacks(listeners.currentColor, color);
  },

  /**
   * @method getCurrentColor
   * @returns {readonly Color}
   */
  getCurrentColor() {
    return store.currentColor;
  },

  /**
   * @param {keyof Store} property
   * @param {ListenerCallback<any>} callback
   */
  listen(property, callback) {
    listeners[property].push(callback);
    return () => {
      // @ts-expect-error
      listeners[property] = listeners[property].filter(i => i != callback);
    }
  }
}