// @ts-check

import { executeHostCommand } from './ipc.js'
import { state } from './state.js'
import { $metadata } from './components/metadata.js'
import { $playback } from './components/playback.js'
import { $editor } from './components/editor.js'
import { Tune, TuneParser } from './sid.js'

const $app = {
  onLoad() {
    try {
      /**
       * @type {(payload: string) => void}
       */
      const loadTune = (payload) => {
        let tune;
        try {
          if (!payload.trim()) {
            tune = new Tune(3);
            tune.setBeatsCount(4);
            tune.setBpm(90);
            tune.setTicksPerBeat(4);
          } else {
            tune = TuneParser.fromString(payload);
            state.setTune(tune);
          }

          state.setTune(tune);
          $app.init();
        } catch (error) {
          executeHostCommand('error', error.message);
        }
      }

      executeHostCommand('getDocumentText', null, loadTune);
    } catch (error) {
      $editor.$root.innerHTML = '';
      executeHostCommand('error', error.message);
    }
  },
  init() {
    console.log('init');
    $metadata.init();
    $playback.init();
    $editor.init();
  }
};

window.addEventListener('load', $app.onLoad);