// @ts-check
/**
 * @typedef {import('./sid').Tune} Tune
 * @typedef {import('./sid').ParserOptions} ParserOptions
 */

/**
 * @type {Object} Listeners
 * @param {((tune: Tune) => void)[]} tune
 * @param {((options: ParserOptions) => void)[]} parserOptions
 */
const listeners = {
  tune: [],
  parserOptions: [],
}

/**
 * @type {Object} State 
 * @param {Tune} tune
 * @param {ParserOptions} options
 */
const store = {
  tune: null,
  parserOptions: null
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
   * @returns {readonly Tune | null}
   */
  getTune() {
    return store.tune;
  },

  /**
   * @method setParserOptions
   * @param {ParserOptions} opts
   */
  setParserOptions(opts) {
    if (store.parserOptions === opts) return;

    store.parserOptions = opts;
    listeners.parserOptions?.forEach(callback => callback(opts));
  },

  /**
   * @method getParserOptions
   * @returns {readonly ParserOptions}
   */
  getParserOptions() {
    return store.parserOptions;
  },

  /**
   * @template T
   * @param {"tune" | "parserOptions"} property
   * @param {(arg: T) => void} callback
   */
  listen(property, callback) {
    listeners[property].push(callback);
  }
}