import { state } from '../state.js';
import { executeHostCommand } from '../ipc.js';

export const $editor = {
  $root: document.getElementById('editor'),
  init() { },
  update(tune) {
    const tracks = tune.getTracksCount()
    const maxTrackLength = tune.getBeatsCount() * tune.getTicksPerBeat();
    const $root = this.$root.cloneNode(false);
    for (let i = 0; i < tracks; i++) {
      const $track = document.createElement('div');
      for (let j = 0; j < maxTrackLength; j++) {
        const $cell = makeCell(tune, i, j);
        $track.appendChild($cell);
      }
      $root.appendChild($track);
    }
    this.$root.replaceWith($root);
  }
}

const makeCell = (tune, track, tick) => {
  const $cell = document.createElement('input');
  $cell.setAttribute('data-track', track);
  $cell.setAttribute('data-tick', tick);
  $cell.value = Module.getNote(tune, track, tick).getSymbol();
  $cell.classList.add('cell');

  let previousValue = $cell.value;
  $cell.addEventListener('keyup', (e) => {
    if (e.target.value === previousValue) return;
    try {
      const note = Module.Player.preview(e.target.value);
      const tune = state.getTune();
      Module.setNote(tune, track, tick, note);
      state.setTune(tune);
      previousValue = e.target.value;
    } catch (error) {
      executeHostCommand('error', error.message);
    }
  })

  $cell.addEventListener('focus', (e) => {
    Module.Player.preview(e.target.value);
  })

  return $cell;
}
