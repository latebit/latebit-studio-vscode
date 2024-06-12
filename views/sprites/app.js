// @ts-check
import { executeHostCommand, listen, Command, Event } from '../ipc.js'
import { $editor } from './components/editor.js';
import { frameManager } from './components/frame.js';
import { $metadata } from './components/metadata.js';
import { $playback } from './components/playback.js';
import { Sprite, SpriteParser } from './renderer.js';
import { state } from './state.js';

// This is not really needed for rendering, but the library exports methods
// that require it to be defined.
const MOCK_SPRITE_LABEL = 'Sprite';

const $app = {
  $banner: /** @type {HTMLElement} */ (document.getElementById('banner')),
  $main:   /** @type {HTMLElement} */ (document.querySelector('main')),
  onLoad() {
    frameManager.init();
    $editor.init();
    $metadata.init();
    $playback.init();

    try {
      /**
       * @type {(payload: string) => void}
       */
      const loadSprite = (payload) => {
        let sprite;
        try {
          if (!payload.trim()) {
            sprite = new Sprite(MOCK_SPRITE_LABEL, 16, 16, 10, 1);
          } else {
            sprite = SpriteParser.fromString(payload, MOCK_SPRITE_LABEL);
            if (!sprite) {
              throw new Error('Failed to parse sprite');
            }
          }

          state.setSprite(sprite);
          $app.init();
          this.handleSuccessLoading();
        } catch (error) {
          this.handleErrorLoading();
        }
      }

      executeHostCommand(Command.GetDocumentText, null, loadSprite);
    } catch (error) {
      this.handleErrorLoading();
    }
  },
  init() {
    // Whenever the text changes for external reasons, we need to update the tune
    listen(Event.DocumentTextUpdated, (text) => {
      try {
        const sprite = SpriteParser.fromString(text, MOCK_SPRITE_LABEL);
        state.setSprite(sprite);
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
      <h2>Unable to load sprite</h3>
      <p>Check the notification for more details.</p>
      <br>
      <p>Please refer to <a href="#">the specification</a> and fix the issue by doing one of the follwing:</p>
      <ul>
        <li>edit the sprite with the built-in Text Editor (right-click on the file and select "Open with...");</li>
        <li>create a new *.lbspr file and recreate the sprite.</li>
      </ul>
      <p>If you are stuck or believe this is a bug, you can <a href="https://github.com/latebit/latebit-studio-vscode/issues/new">open an issue</a> and look for help.</p>
    </span>
    `;
  },
};

$app.onLoad();