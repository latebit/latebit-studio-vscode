// @ts-check

import { state } from './state.js'
import { $metadata } from './components/metadata.js'
import { $playback } from './components/playback.js'
import { $editor } from './components/editor.js'
import { TuneParser, createEmptyTune } from './player.js'
import { executeHostCommand, listen, Command, Event } from '../ipc.js'
import { ParserOptions, ViewType } from './constants.js'

/** @global */
globalThis.viewType = globalThis.viewType

const parserOptions = ParserOptions[viewType];

const $app = {
  /** @type {!HTMLElement} */
  // @ts-expect-error
  $banner: document.getElementById('banner'),
  /** @type {!HTMLElement} */
  // @ts-expect-error
  $main: document.querySelector('main'),
  onLoad() {
    try {
      $metadata.init();
      $playback.init();
      $editor.init();

      /**
       * @type {(payload: string) => void}
       */
      const loadTune = (payload) => {
        let tune;
        try {
          if (!payload.trim()) {
            tune = createEmptyTune(90, 4, 4, parserOptions.maxTracksCount);
          } else {
            tune = TuneParser.fromString(payload, parserOptions);
            if (!tune) {
              throw new Error('Failed to parse tune');
            }
          }

          state.setTune(tune);
          $app.init();
          this.handleSuccessLoading();
        } catch (error) {
          this.handleErrorLoading();
        }
      }

      executeHostCommand(Command.GetDocumentText, null, loadTune);
    } catch (error) {
      this.handleErrorLoading();
    }
  },
  init() {
    // Whenever the text changes for external reasons, we need to update the tune
    listen(Event.DocumentTextUpdated, (text) => {
      try {
        const tune = TuneParser.fromString(text, parserOptions);
        state.setTune(tune);
      } catch (error) {
        executeHostCommand(Command.Error, error.message);
      }
    })
  },
  handleSuccessLoading() {
    this.$banner.parentNode?.removeChild(this.$banner);
    this.$main.removeAttribute('hidden');
  },
  handleErrorLoading() {
    this.$main.setAttribute('hidden', '');
    this.$banner.classList.add('error');
    this.$banner.innerHTML = `
    <i class="codicon codicon-error"></i> 
    <span class="message">
      <h2>Unable to load tune</h3>
      <p>Check the notification for more details.</p>
      <br>
      <p>Please refer to <a href="https://github.com/latebit/latebit-engine/blob/main/docs/specs/sid-v0.md">the specification</a> and fix the issue by doing one of the follwing:</p>
      <ul>
        <li>edit the tune with the built-in Text Editor (right-click on the file and select "Open with...");</li>
        <li>create a new *.${viewType == ViewType.Music ? 'lbmus' : 'lbsfx'} file and copy over the cells one by one.</li>
      </ul>
      <p>If you are stuck or believe this is a bug, you can <a href="https://github.com/latebit/latebit-studio-vscode/issues/new">open an issue</a> and look for help.</p>
    </span>
    `;
  },
};

$app.onLoad();