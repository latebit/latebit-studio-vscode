// @ts-check

import { state } from './state.js'
import { $metadata } from './components/metadata.js'
import { $playback } from './components/playback.js'
import { $editor } from './components/editor.js'
import { Note, Player, Tune, TuneParser } from './sid.js'
import { executeHostCommand, listen, Command, Event } from '../ipc.js'

const keyToNote = {
  'KeyZ': Note.fromSymbol('C-4---'),
  'KeyX': Note.fromSymbol('D-4---'),
  'KeyC': Note.fromSymbol('E-4---'),
  'KeyV': Note.fromSymbol('F-4---'),
  'KeyB': Note.fromSymbol('G-4---'),
  'KeyN': Note.fromSymbol('A-4---'),
  'KeyM': Note.fromSymbol('B-4---'),
  'KeyS': Note.fromSymbol('C#4---'),
  'KeyD': Note.fromSymbol('D#4---'),
  'KeyG': Note.fromSymbol('F#4---'),
  'KeyH': Note.fromSymbol('G#4---'),
  'KeyJ': Note.fromSymbol('A#4---'),
  'Comma': Note.fromSymbol('C-5---'),
};

const $piano = {
  init() {
    document.addEventListener('keydown', (e) => {
      if (document.activeElement === document.body && keyToNote[e.code]) {
        Player.playNote(keyToNote[e.code]);
      }
    })
  }
}

const $app = {
  onLoad() {
    $metadata.init();
    $playback.init();
    $editor.init();
    $piano.init();

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
        const tune = TuneParser.fromString(text);
        state.setTune(tune);
      } catch (error) {
        executeHostCommand(Command.Error, error.message);
      }
    })
  }
};

$app.onLoad();