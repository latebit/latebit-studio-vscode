// @ts-check
import { Player, Tune } from '../sid.js';
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
  init() {
    state.listen('tune', (tune) => this.update(tune));
    // @ts-expect-error Cannot type these handlers
    this.$bpm.addEventListener('change', (e) => setBpm(e.target?.value));
    // @ts-expect-error Cannot type these handlers
    this.$ticks.addEventListener('change', (e) => setTicks(e.target?.value));
    // @ts-expect-error Cannot type these handlers
    this.$beats.addEventListener('change', (e) => setBeats(e.target?.value));
  },
  /**
   * @param {Tune} tune
   */
  update(tune) {
    this.$bpm.value = tune.getBpm().toString();
    this.$ticks.value = tune.getTicksPerBeat().toString();
    this.$beats.value = tune.getBeatsCount().toString();
  }
}

const setBpm = (/** @type {number} */ value) => {
  $metadata.$bpm.value = value.toString();
  const tune = state.getTune();
  if (!tune) return;

  tune.setBpm(value);
  state.setTune(tune);
  maybeRestart();
  console.log('bpm set');
}

const setBeats = (/** @type {number} */ value) => {
  $metadata.$beats.value = value.toString();
  const tune = state.getTune();
  if (!tune) return;

  tune.setBeatsCount(value);
  state.setTune(tune);
  maybeRestart();
}

const setTicks = (/** @type {number} */ value) => {
  $metadata.$ticks.value = value.toString();
  const tune = state.getTune();
  if (!tune) return;

  tune.setTicksPerBeat(value);
  state.setTune(tune);
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