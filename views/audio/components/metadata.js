// @ts-check
import { Player, Tune, setBeatsCount, setBpm, setTicksPerBeat } from '../sid.js';
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
    this.$bpm.addEventListener('change', (e) => setTempo(e.target?.value));
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

const setTempo = (/** @type {number} */ value) => {
  $metadata.$bpm.value = value.toString();
  const tune = state.getTune();
  if (!tune) return;

  state.setTune(setBpm(tune, value));
  maybeRestart();
}

const setBeats = (/** @type {number} */ value) => {
  $metadata.$beats.value = value.toString();
  const tune = state.getTune();
  if (!tune) return;

  state.setTune(setBeatsCount(tune, value));
  maybeRestart();
}

const setTicks = (/** @type {number} */ value) => {
  $metadata.$ticks.value = value.toString();
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