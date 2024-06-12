// @ts-check
/**
 * @typedef {import('./renderer').Sprite} Sprite
 */
import { Color, isSameSprite } from './renderer.js';

/**
 * @type {Object} Listeners
 * @param {((sprite: Sprite) => void)[]} sprite
 * @param {((zoom: number) => void)[]} zoom
 * @param {((currentFrame: number) => void)[]} currentFrame
 */
const listeners = {
  sprite: [],
  zoom: [],
  currentFrame: [],
  currentColor: [],
}

/**
 * @type {Object} State 
 * @param {Sprite} sprite
 * @param {number} zoom
 * @param {number} currentFrame
 * @param {Color[keyof Color]} currentColor
 */
const store = {
  sprite: null,
  zoom: 1,
  currentFrame: 0,
  currentColor: Color.BLACK,
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
   * @method setCurrentFrame
   * @param {number} frame
   */
  setCurrentFrame(frame) {
    store.currentFrame = frame;
    triggerAllCallbacks(listeners.currentFrame, frame);
  },

  /**
   * @method getCurrentFrame
   */
  getCurrentFrame() {
    return store.currentFrame;
  },

  /**
   * @method setCurrentColor
   * @param {Color[keyof Color]} color
   */
  setCurrentColor(color) {
    store.currentColor = color;
    triggerAllCallbacks(listeners.currentColor, color);
  },

  /**
   * @method getCurrentColor
   * @returns {readonly Color[keyof Color]}
   */
  getCurrentColor() {
    return store.currentColor;
  },

  /**
   * @template T
   * @param {"sprite"|"currentFrame"|"currentColor"} property
   * @param {(arg: T) => void} callback
   */
  listen(property, callback) {
    listeners[property].push(callback);
    return () => {
      listeners[property] = listeners[property].filter(i => i != callback);
    }
  }
}