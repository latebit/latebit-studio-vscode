// @ts-check

import { state } from './state.js'
import { $metadata } from './components/metadata.js'
import { $playback } from './components/playback.js'
import { $editor } from './components/editor.js'
import { MUSIC_PARSER_OPTIONS, TuneParser, createEmptyTune } from './sid.js'
import { executeHostCommand, listen, Command, Event } from '../ipc.js'

const $app = {
  onLoad() {
    state.setParserOptions(MUSIC_PARSER_OPTIONS);
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
            tune = TuneParser.fromString(payload, state.getParserOptions());
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
        const tune = TuneParser.fromString(text, state.getParserOptions());
        state.setTune(tune);
      } catch (error) {
        executeHostCommand(Command.Error, error.message);
      }
    })
  }
};

$app.onLoad();