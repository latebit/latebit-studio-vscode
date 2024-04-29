import { state } from '../state.js';

export const $metadata = {
  $bpm: document.getElementById('bpm'),
  $ticks: document.getElementById('ticks'),
  $beats: document.getElementById('beats'),
  init() {
    state.listen('tune', (tune) => this.update(tune));
    this.$bpm.addEventListener('change', (e) => setBpm(e.target.value));
    this.$ticks.addEventListener('change', (e) => setTicks(e.target.value));
    this.$beats.addEventListener('change', (e) => setBeats(e.target.value));
  },
  update(tune) {
    this.$bpm.value = tune.getBpm();
    this.$ticks.value = tune.getTicksPerBeat();
    this.$beats.value = tune.getBeatsCount();
  }
}

const setBpm = (value) => {
  $metadata.$bpm.value = value;
  const tune = state.getTune();
  tune.setBpm(value);
  state.setTune(tune);
  maybeRestart();
}

const setBeats = (value) => {
  $metadata.$beats.value = value;
  const tune = state.getTune();
  tune.setBeatsCount(value);
  state.setTune(tune);
  maybeRestart();
}

const setTicks = (value) => {
  $metadata.$ticks.value = value;
  const tune = state.getTune();
  tune.setTicksPerBeat(value);
  state.setTune(tune);
  maybeRestart();
}

// Pause and play the tune if it's already playing
// so that the new settings take effect
const maybeRestart = () => {
  if (Module.Player.isPlaying()) {
    Module.Player.pause();
    Module.Player.play(state.getTune());
  }
}