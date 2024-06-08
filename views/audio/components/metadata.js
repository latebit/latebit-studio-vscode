// @ts-check
import { Command, executeHostCommand } from '../../ipc.js';
import { ParserOptions, ViewType } from '../constants.js';
import { Player, Tune, setBeatsCount, setBpm, setTicksPerBeat, setTracksCount } from '../sid.js';
import { state } from '../state.js';

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
  /** @type {!HTMLInputElement} */
  // @ts-expect-error
  $tracks: document.getElementById('tracks'),
  init() {

    // TODO: this should be shared since it's loaded once, move to constants
    const options = ParserOptions[globalThis.viewType];
    if (!options) {
      executeHostCommand(Command.Error, `Invalid view type. Wanted ${Object.keys(ParserOptions).join(',')} got ${globalThis.viewType}.`)
    }
    const isSound = globalThis.viewType == ViewType.Sound;

    this.$beats.max = options.maxBeatsCount.toString();
    this.$beats.style.display = isSound ? 'none' : 'unset';
    this.$beats.labels?.forEach(label => label.style.display = isSound ? 'none' : 'unset');

    setLabel(this.$bpm, isSound ? 'Speed' : 'BPM');

    setLabel(this.$ticks, isSound ? 'Ticks' : 'Ticks per beat');
    this.$ticks.max = options.maxTicksPerBeat.toString();

    this.$tracks.max = options.maxTracksCount.toString();

    // Setup listeners
    state.listen('tune', (tune) => this.update(tune));

    this.$bpm.addEventListener('change', (e) => {
      setField(/** @type {HTMLInputElement} */(e.target), setTicksPerBeat);
    });

    this.$ticks.addEventListener('change', (e) => {
      setField(/** @type {HTMLInputElement} */(e.target), setTicksPerBeat);
    });

    this.$beats.addEventListener('change', (e) => {
      setField(/** @type {HTMLInputElement} */(e.target), setBeatsCount);
    });

    this.$tracks.addEventListener('change', (e) => {
      setField(/** @type {HTMLInputElement} */(e.target), setTracksCount);
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
    this.$tracks.value = tune.getTracksCount().toString();
    this.$tracks.defaultValue = tune.getTracksCount().toString();
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

const setField = (
  /** @type {HTMLInputElement} */ field,
  /** @type {(tune: Tune, value: number) => Tune} */ callback) => {
  const label = getLabel(field);

  if (assertValid(label, field)) {
    const value = field.valueAsNumber;
    field.value = value.toString();
    // Setting default value to allow reverting the changes in case of errors
    // See assertValid function above
    field.defaultValue = value.toString();
    const tune = state.getTune();
    if (!tune) return;

    state.setTune(callback(tune, value));
    maybeRestart();
  }
}

const getLabel = (/** @type {HTMLInputElement} */ field) => field.labels?.[0].innerText ?? 'field'
const setLabel = (/** @type {HTMLInputElement} */ field, /** @type {string} */ value) => field.labels?.forEach(label => label.innerText = value);

// Pause and play the tune if it's already playing
// so that the new settings take effect
const maybeRestart = () => {
  const tune = state.getTune();
  if (Player.isPlaying() && tune) {
    Player.pause();
    Player.play(tune);
  }
}