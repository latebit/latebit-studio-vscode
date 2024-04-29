import { state } from '../state.js';
import { executeHostCommand } from '../ipc.js';

export const $editor = {
  $root: document.getElementById('editor'),
  init() {
    state.listen('tune', (tune) => this.update(tune));
  },
  update(tune) {
    debugger
    const tracks = tune.getTracksCount()
    const maxTrackLength = tune.getBeatsCount() * tune.getTicksPerBeat();
    const $root = this.$root.cloneNode(false);

    // Add an index column 
    const $indexColumn = document.createElement('div');
    for (let j = 0; j < maxTrackLength; j++) {
      const $index = document.createElement('div');
      $index.appendChild(document.createTextNode(j));
      $index.classList.add('index');
      if (j % tune.getTicksPerBeat() === 0) {
        $index.classList.add('beat');
      }
      $indexColumn.appendChild($index);
    }
    $root.appendChild($indexColumn);

    for (let i = 0; i < tracks; i++) {
      const $track = document.createElement('div');
      for (let j = 0; j < Module.getTrackSize(tune, i); j++) {
        const $cell = makeCell(tune, i, j);
        $track.appendChild($cell);
      }

      if (Module.getTrackSize(tune, i) < maxTrackLength) {
        const $btn = document.createElement('button');
        $btn.textContent = '+';
        $btn.addEventListener('click', () => {
          const note = Module.Note.makeRest();
          const tune = state.getTune();
          Module.setNote(tune, i, Module.getTrackSize(tune, i), note);
          state.setTune(tune);
        });
        $track.appendChild($btn);
      }

      $root.appendChild($track);
    }
    this.$root.replaceWith($root);
    this.$root = $root;
  }
}

const makeCell = (tune, track, tick) => {
  const $cell = document.createElement('input');
  $cell.value = Module.getNote(tune, track, tick).getSymbol();
  $cell.classList.add('cell');

  if (tick % tune.getTicksPerBeat() === 0) {
    $cell.classList.add('beat');
  }

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