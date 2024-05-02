// @ts-check
/**
 * @typedef {import('./sid').Tune} Tune
 */

/**
 * @type {Object} Listeners
 * @param {((tune: Tune) => void)[]} tune
 */
const listeners = {
  tune: [],
}

/**
 * @type {Object} State 
 * @param {Tune} tune
 */
const store = {
  tune: null,
}

export const state = {
  /**
   * @method setTune
   * @param {Tune} tune
   */
  setTune(tune) {
    if (tune === store.tune) return;

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
   * @template T
   * @param {"tune" | "currentTick"} property
   * @param {(arg: T) => void} callback
   */
  listen(property, callback) {
    listeners[property].push(callback);
  }
}