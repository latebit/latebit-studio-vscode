// @ts-check
import { state } from '../state.js';
import { executeHostCommand } from '../ipc.js';
import { Note, Player, Tune, getNote, getTrackSize, removeNote, setNote } from '../sid.js';

export const $editor = {
  /** @type {!HTMLElement} */
  // @ts-expect-error
  $root: document.getElementById('editor'),
  init() {
    state.listen('tune', (tune) => this.update(tune));
  },
  /**
   * @param {Tune} tune
   */
  update(tune) {
    const tracks = tune.getTracksCount()
    const maxTrackLength = tune.getBeatsCount() * tune.getTicksPerBeat();
    const $root = this.$root.cloneNode(false);

    // Add an index column 
    const $indexColumn = document.createElement('div');
    for (let j = 0; j < maxTrackLength; j++) {
      const $index = document.createElement('div');
      $index.appendChild(document.createTextNode(j.toString()));
      $index.classList.add('index');
      if (j % tune.getTicksPerBeat() === 0) {
        $index.classList.add('beat');
      }
      $indexColumn.appendChild($index);
    }
    $root.appendChild($indexColumn);

    for (let i = 0; i < tracks; i++) {
      const $track = document.createElement('div');
      for (let j = 0; j < getTrackSize(tune, i); j++) {
        const $cell = makeCell(tune, i, j);
        $track.appendChild($cell);
      }

      const trackSize = getTrackSize(tune, i);
      if (trackSize < maxTrackLength) {
        const $btn = document.createElement('button');
        $btn.classList.add('add', 'codicon', 'codicon-plus');

        if (trackSize % tune.getTicksPerBeat() === 0) {
          $btn.classList.add('beat');
        }

        $btn.addEventListener('click', () => {
          const tune = state.getTune();
          if (!tune) return;

          const note = Note.makeRest();
          setNote(tune, i, getTrackSize(tune, i), note);
          state.setTune(tune);
        });
        $track.appendChild($btn);
      }

      $root.appendChild($track);
    }
    this.$root.replaceWith($root);
    // @ts-expect-error This is a valid assignment: $root is a Node, but also an Element
    this.$root = $root;
  }
}

const makeCell = (tune, track, tick) => {
  const $input = document.createElement('input');
  $input.value = getNote(tune, track, tick).getSymbol();
  $input.classList.add('input');

  let previousValue = $input.value;
  $input.addEventListener('keyup', (e) => {
    // @ts-expect-error
    const value = e.target?.value;
    if (value === previousValue) return;

    const note = Player.parse(value);
    if (note.isInvalid()) return;

    try {
      Player.preview(value);
      previousValue = value;
    } catch (error) {
      executeHostCommand('error', error.message);
    }
  })

  $input.addEventListener('change', (e) => {
    // @ts-expect-error
    const symbol = e.target?.value;
    const note = Player.parse(symbol);
    if (note.isInvalid()) {
      executeHostCommand('error', `Invalid symbol: ${symbol}`);
      $input.value = previousValue;
      return
    }

    try {
      const tune = state.getTune();
      if (!tune) return;
      setNote(tune, track, tick, note);
      state.setTune(tune);
    } catch (error) {
      executeHostCommand('error', error);
    }
  });

  $input.addEventListener('focus', (e) => {
    // @ts-expect-error
    Player.preview(e.target.value);
  })

  const $delete = document.createElement('button');
  $delete.classList.add('delete', 'codicon', 'codicon-close');
  $delete.addEventListener('click', () => {
    const tune = state.getTune();
    if (!tune) return;
    removeNote(tune, track, tick);
    state.setTune(tune);
  });

  const $cell = document.createElement('div');
  $cell.classList.add('cell');
  $cell.appendChild($input)
  $cell.appendChild($delete)

  if (tick % tune.getTicksPerBeat() === 0) {
    $cell.classList.add('beat');
  }

  return $cell;
}