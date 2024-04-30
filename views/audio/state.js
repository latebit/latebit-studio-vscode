// @ts-check
/**
 * @typedef {import('./sid').Tune} Tune
 */

/**
 * @type {Object} Listeners
 * @param {((tune: Tune) => void)[]} tune
 * @param {(tick: number) => void[]} currentTick
 */
const listeners = {
  tune: [],
  currentTick: []
}

/**
 * @type {Object} State 
 * @param {Tune} tune
 * @param {number} currentTick
*/
const store = {
  tune: null,
  currentTick: -1,
}

export const state = {
  /**
   * @method setTune
   * @param {Tune} tune
   */
  setTune(tune) {
    store.tune = tune;
    listeners.tune?.forEach(callback => callback(tune));
  },
  /**
   * @method getTune
   * @returns {Tune | null}
   */
  getTune() {
    return store.tune;
  },

  /**
   * @param {number} tick
   */
  setCurrentTick(tick) {
    store.currentTick = tick;
    listeners.currentTick?.forEach(callback => callback(tick));
  },
  /**
   * @returns {number}
   */
  getCurrentTick() {
    return store.currentTick;
  },

  /**
   * @template T
   * @param {"tune" | "currentTick"} property
   * @param {(arg: T) => void} callback
   */
  listen(property, callback) {
    listeners[property].push(callback);
  }
}