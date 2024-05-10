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

/**
 * TODO: If we see this changing a lot it migth be a good idea to move it into the library itself
 * @param {Tune | null} a 
 * @param {Tune | null} b 
 * @returns 
 */
const isSameTune = (a, b) => {
  return a?.getBpm() === b?.getBpm() &&
    a?.getBeatsCount() === b?.getBeatsCount() &&
    a?.getTicksPerBeat() === b?.getTicksPerBeat() &&
    a?.getTracksCount() === b?.getTracksCount();
}

export const state = {
  /**
   * @method setTune
   * @param {Tune} tune
   */
  setTune(tune) {
    if (isSameTune(tune, state.tune)) return;

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