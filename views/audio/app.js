import { executeHostCommand } from './ipc.js'
import { $metadata } from './components/metadata.js'
import { $playback } from './components/playback.js'
import { $editor } from './components/editor.js'
import { state } from './state.js'

const $app = {
  init() {
    try {
      $metadata.init();
      $playback.init();
      $editor.init();
      executeHostCommand('getDocumentText', null, (payload) => {
        try {
          const tune = Module.TuneParser.fromString(payload);
          $metadata.update(tune);
          $editor.update(tune);
          $playback.$play.disabled = false;
          $playback.$loop.disabled = false;
          state.setTune(tune);
        } catch (error) {
          executeHostCommand('error', error.message);
        }
      });
    } catch (error) {
      $editor.$root.innerHTML = '';
      executeHostCommand('error', error.message);
    }
  }
};

window.addEventListener('load', $app.init);