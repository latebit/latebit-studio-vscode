// @ts-check

import { state } from './state.js'
import { $metadata } from './components/metadata.js'
import { $playback } from './components/playback.js'
import { $editor } from './components/editor.js'
import { ParserOptions, TuneParser, createEmptyTune } from './sid.js'
import { executeHostCommand, listen, Command, Event } from '../ipc.js'

// TODO: get from lib
const parserOptions = new ParserOptions();
parserOptions.maxTracksCount = 3;
parserOptions.maxBeatsCount = 64;
parserOptions.maxTicksPerBeat = 16;


const $app = {
  onLoad() {
    $metadata.init();
    $playback.init();
    $editor.init();

    try {
      /**
       * @type {(payload: string) => void}
       */
      const loadTune = (payload) => {
        let tune;
        try {
          if (!payload.trim()) {
            tune = createEmptyTune(90, 4, 4);
          } else {
            tune = TuneParser.fromString(payload, parserOptions);
            if (!tune) {
              throw new Error('Failed to parse tune. Check specification or console for more information.');
            }
          }

          state.setTune(tune);
          $app.init();
        } catch (error) {
          $editor.$root.innerHTML = '';
          executeHostCommand(Command.Error, error.message);
        }
      }

      executeHostCommand(Command.GetDocumentText, null, loadTune);
    } catch (error) {
      $editor.$root.innerHTML = '';
      executeHostCommand(Command.Error, error.message);
    }
  },
  init() {
    // Whenever the text changes for external reasons, we need to update the tune
    listen(Event.DocumentTextUpdated, (text) => {
      try {
        // TODO: get from lib
        const tune = TuneParser.fromString(text, parserOptions);
        state.setTune(tune);
      } catch (error) {
        executeHostCommand(Command.Error, error.message);
      }
    })
  }
};

$app.onLoad();