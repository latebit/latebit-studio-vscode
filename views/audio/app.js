// @ts-check

import { executeHostCommand } from './ipc.js'
import { state } from './state.js'
import { $metadata } from './components/metadata.js'
import { $playback } from './components/playback.js'
import { $editor } from './components/editor.js'
import { $edit } from './components/edit.js'
import { Tune, TuneParser } from './sid.js'

const $app = {
  init() {
    try {
      $metadata.init();
      $playback.init();
      $editor.init();
      $edit.init();

      /**
       * @type {(payload: string) => void}
       */
      const onResponse = (payload) => {
        if (!payload.trim()) {
          const tune = new Tune(3);
          tune.setBeatsCount(4);
          tune.setBpm(90);
          tune.setTicksPerBeat(4);
          state.setTune(tune);
          $playback.$play.disabled = false;
          $playback.$loop.disabled = false;
          $playback.$stop.disabled = false;
          return;
        }

        try {
          const tune = TuneParser.fromString(payload);
          state.setTune(tune);
          $playback.$play.disabled = false;
          $playback.$loop.disabled = false;
          $playback.$stop.disabled = false;
        } catch (error) {
          executeHostCommand('error', error.message);
        }
      }

      executeHostCommand('getDocumentText', null, onResponse);
    } catch (error) {
      $editor.$root.innerHTML = '';
      executeHostCommand('error', error.message);
    }
  }
};

window.addEventListener('load', $app.init);