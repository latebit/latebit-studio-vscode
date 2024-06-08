// @ts-check
import { state } from '../state.js';
import { executeHostCommand, Command } from '../../ipc.js';
import { Note, Tune, TuneParser, getNote, setNote, symbolFromPitch } from '../sid.js'

export const $sound = {
  /** @type {!HTMLElement} */
  // @ts-expect-error
  $root: document.getElementById('editor'),
  init() {
    state.listen('tune', (tune) => {
      this.update(tune);
      executeHostCommand(Command.UpdateDocumentText, TuneParser.toString(tune));
    });

  },
  update(/** @type {Tune} */ tune) {
    const maxTrackLength = tune.getBeatsCount() * tune.getTicksPerBeat();
    const $root = this.$root.cloneNode(false);

    // TODO: support more tracks
    const trackIndex = 0;
    // TODO: support more waves 
    const wave = 0;

    for (let i = 0; i < maxTrackLength; i++) {
      const $container = document.createElement('div');
      $container.classList.add('slider-container');
      const $slider = document.createElement('input');
      $slider.type = 'range';
      $slider.min = '0';
      $slider.max = '95';
      $slider.classList.add('slider');
      $slider.value = getNote(tune, trackIndex, i).getPitch().toString();
      const $preview = document.createElement('input');
      $preview.disabled = true;
      $preview.value = $slider.value;
      $slider.addEventListener('change', (e) => {
        const field = /** @type {HTMLInputElement} */ (e.target);
        $preview.value = field.value;
        const note = Note.fromSymbol(symbolFromPitch(field.valueAsNumber, wave))
        state.setTune(setNote(tune, trackIndex, i, note));
      })
      $container.appendChild($slider);
      $container.appendChild($preview);
      $root.appendChild($container);
    }

    this.$root.replaceWith($root);
    // @ts-expect-error This is a valid assignment: $root is a Node, but also an Element
    this.$root = $root;
    this.$root.classList.add('with-sliders');
  }
}