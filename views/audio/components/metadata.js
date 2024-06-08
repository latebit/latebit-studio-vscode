// @ts-check
import { Command, executeHostCommand } from '../../ipc.js';
import { ParserOptions, ViewType } from '../constants.js';
import { MUSIC_PARSER_OPTIONS, Player, SOUND_PARSER_OPTIONS, Tune, setBeatsCount, setBpm, setTicksPerBeat } from '../sid.js';
import { state } from '../state.js';

/**
 * @typedef {import('../sid').ParserOptions} ParserOptions
 */

const PARSER_OPTIONS = {
  sound: SOUND_PARSER_OPTIONS,
  music: MUSIC_PARSER_OPTIONS,
}

export const $metadata = {
  /** @type {!HTMLInputElement} */
  // @ts-expect-error
  $bpm: document.getElementById('bpm'),
  /** @type {!HTMLInputElement} */
  // @ts-expect-error
  $ticks: document.getElementById('ticks'),
  /** @type {!HTMLInputElement} */
  // @ts-expect-error
  $beats: document.getElementById('beats'),
  /** @type {!HTMLSelectElement} */
  // @ts-expect-error
  $mode: document.getElementById('mode'),
  init(/** @type {ParserOptions} */ settings) {
    state.listen('tune', (tune) => this.update(tune));

    const options = ParserOptions[globalThis.viewType];
    if (!options) {
      executeHostCommand(Command.Error, `Invalid view type. Wanted ${Object.keys(ParserOptions).join(',')} got ${globalThis.viewType}.`)
    }
    const isSound = globalThis.viewType == ViewType.Sound;

    this.$beats.max = options.maxBeatsCount.toString();
    this.$beats.style.display = isSound ? 'none' : 'unset';
    this.$beats.labels?.forEach(label => label.style.display = isSound ? 'none' : 'unset');

    this.$bpm.labels?.forEach(label => label.innerText = isSound ? 'Speed' : 'BPM');

    this.$ticks.labels?.forEach(label => label.innerText = isSound ? 'Ticks' : 'Ticks per beat');
    this.$ticks.max = options.maxTicksPerBeat.toString();

    this.$bpm.addEventListener('change', (e) => {
      const field = /** @type {HTMLInputElement} */ (e.target);

      if (assertValid("BPM", field)) {
        setTempo(field.valueAsNumber)
      }
    });
    this.$ticks.addEventListener('change', (e) => {
      const field = /** @type {HTMLInputElement} */ (e.target);

      if (assertValid("Ticks per beat", field)) {
        setTicks(field.valueAsNumber)
      }
    });

    this.$beats.addEventListener('change', (e) => {
      const field = /** @type {HTMLInputElement} */ (e.target);

      if (assertValid("Number of beats", field)) {
        setBeats(field.valueAsNumber)
      }
    });
  },
  /**
   * @param {Tune} tune
   */
  update(tune) {
    this.$bpm.value = tune.getBpm().toString();
    this.$bpm.defaultValue = tune.getBpm().toString();
    this.$ticks.value = tune.getTicksPerBeat().toString();
    this.$ticks.defaultValue = tune.getTicksPerBeat().toString();
    this.$beats.value = tune.getBeatsCount().toString();
    this.$beats.defaultValue = tune.getBeatsCount().toString();
  }
}

const assertValid = (/** @type {string} */ label, /** @type {HTMLInputElement | null} */ field) => {
  if (!field) return false;

  if (!field.validity.valid) {
    executeHostCommand(Command.Error, `Invalid value for ${label}. Expected a number ${field.min}-${field.max}.`);
    field.value = field.defaultValue;
    return false;
  }
  return true;
}

const setTempo = (/** @type {number} */ value) => {
  $metadata.$bpm.value = value.toString();
  // Setting default value to allow reverting the changes in case of errors
  // See assertValid function above
  $metadata.$bpm.defaultValue = value.toString();
  const tune = state.getTune();
  if (!tune) return;

  state.setTune(setBpm(tune, value));
  maybeRestart();
}

const setBeats = (/** @type {number} */ value) => {
  $metadata.$beats.value = value.toString();
  // Setting default value to allow reverting the changes in case of errors
  // See assertValid function above
  $metadata.$beats.defaultValue = value.toString();
  const tune = state.getTune();
  if (!tune) return;

  state.setTune(setBeatsCount(tune, value));
  maybeRestart();
}

const setTicks = (/** @type {number} */ value) => {
  $metadata.$ticks.value = value.toString();
  // Setting default value to allow reverting the changes in case of errors
  // See assertValid function above
  $metadata.$ticks.defaultValue = value.toString();
  const tune = state.getTune();
  if (!tune) return;

  state.setTune(setTicksPerBeat(tune, value));
  maybeRestart();
}

// Pause and play the tune if it's already playing
// so that the new settings take effect
const maybeRestart = () => {
  const tune = state.getTune();
  if (Player.isPlaying() && tune) {
    Player.pause();
    Player.play(tune);
  }
}