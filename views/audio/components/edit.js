// @ts-check
import { state } from '../state.js';
import { executeHostCommand } from '../ipc.js';
import { TuneParser } from '../sid.js';

export const $edit = {
  /** @type {!HTMLElement} */
  // @ts-expect-error
  $root: document.getElementById('edit'),
  /** @type {!HTMLButtonElement} */
  // @ts-expect-error
  $save: document.getElementById('save'),
  /** @type {!HTMLButtonElement} */
  // @ts-expect-error
  $load: document.getElementById('load'),
  init() {
    this.$save.addEventListener('click', (e) => {
      e.preventDefault();
      const tune = state.getTune();
      if (!tune) {
        executeHostCommand('error', 'No tune to save');
        return;
      }
      const stringTune = TuneParser.toString(tune);
      executeHostCommand('saveDocumentText', stringTune, () => {
        executeHostCommand('info', 'Tune saved');
      }, (error) => {
        executeHostCommand('error', error.message);
      });
    });

    this.$load.addEventListener('click', (e) => {
      e.preventDefault();
      executeHostCommand('getDocumentText', null, (payload) => {
        try {
          const tune = TuneParser.fromString(payload);
          state.setTune(tune);
        } catch (error) {
          executeHostCommand('error', error.message);
        }
      });
    });
  }
}