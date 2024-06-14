// @ts-check
import { Color, isSameSprite, Sprite } from './renderer.js';
import { Tool } from './constants.js';

/**
 * @template T
 * @typedef {(value: T) => void} ListenerCallback<T>
*/

/**
 * @typedef {Object} Store 
 * @property {Sprite} sprite
 * @property {number} zoom
 * @property {number} frameIndex
 * @property {Color} activeColor
 * @property {import('./constants.js').ToolType} tool
 */

/**
 * @type {Store} store
 */
const store = {
  sprite: new Sprite("", 0, 0, 0, 0),
  zoom: 1,
  frameIndex: 0,
  activeColor: Color.BLACK,
  tool: Tool.Pencil,
}

/**
 * @typedef {Object} Listeners
 * @property {ListenerCallback<Store['sprite']>[]} sprite
 * @property {ListenerCallback<Store['zoom']>[]} zoom
 * @property {ListenerCallback<Store['frameIndex']>[]} frameIndex
 * @property {ListenerCallback<Store['activeColor']>[]} activeColor
 * @property {ListenerCallback<Store['tool']>[]} tool
 */

/** @type {Listeners} */
const listeners = {
  sprite: [],
  zoom: [],
  frameIndex: [],
  activeColor: [],
  tool: [],
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
    if ((!!sprite && !!state.sprite && isSameSprite(sprite, state.sprite))) return;

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
   * @method setFrameIndex
   * @param {number} index
   */
  setFrameIndex(index) {
    store.frameIndex = index;
    triggerAllCallbacks(listeners.frameIndex, index);
  },

  /**
   * @method getFrameIndex
   * @returns {readonly Store['frameIndex']}
   */
  getFrameIndex() {
    return store.frameIndex;
  },

  /**
   * @method setCurrentColor
   * @param {Color} color
   */
  setActiveColor(color) {
    store.activeColor = color;
    triggerAllCallbacks(listeners.activeColor, color);
  },

  /**
   * @method getActiveColor
   * @returns {readonly Color}
   */
  getActiveColor() {
    return store.activeColor;
  },

  /**
   * @method setTool
   * @param {import('./constants.js').ToolType} tool
   */
  setTool(tool) {
    store.tool = tool;
    triggerAllCallbacks(listeners.tool, tool);
  },

  /**
   * @method getTool
   * @returns {readonly Store['tool']}
   */
  getTool() {
    return store.tool;
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