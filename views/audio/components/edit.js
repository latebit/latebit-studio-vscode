import { state } from '../state.js';
import { executeHostCommand } from '../ipc.js';

export const $edit = {
  $root: document.getElementById('edit'),
  $save: document.getElementById('save'),
  $load: document.getElementById('load'),
  init() {
    this.$save.addEventListener('click', (e) => {
      e.preventDefault();
      const stringTune = Module.TuneParser.toString(state.getTune());
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
          const tune = Module.TuneParser.fromString(payload);
          state.setTune(tune);
        } catch (error) {
          executeHostCommand('error', error.message);
        }
      });
    });
  }
}