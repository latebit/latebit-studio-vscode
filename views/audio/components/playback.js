//@ts-check
import { executeHostCommand } from '../ipc.js';
import { state } from '../state.js';
import { Player } from '../sid.js';

export const $playback = {
  /** @type {!HTMLButtonElement} */
  // @ts-expect-error
  $play: document.getElementById('play'),
  /** @type {!HTMLButtonElement} */
  // @ts-expect-error
  $loop: document.getElementById('loop'),
  /** @type {!HTMLButtonElement} */
  // @ts-expect-error
  $stop: document.getElementById('stop'),
  init() {
    this.$play.disabled = true;
    this.$stop.disabled = true;
    this.$play.addEventListener('click', handleClickPlay);
    this.$stop.addEventListener('click', handleClickStop);
    this.$loop.addEventListener('change', handleToggleLoop);
  }
}

const handleToggleLoop = (e) => Player.setLoop(e.target.checked);
const handleClickPlay = (e) => {
  e.preventDefault();
  try {
    if (Player.isPlaying()) {
      return Player.pause();
    }
    const tune = state.getTune();
    if (!tune) {
      executeHostCommand('error', 'No tune to play');
      return;
    }
    Player.play(tune);
  } catch (e) {
    executeHostCommand('error', e.message);
  }
}

const handleClickStop = (e) => {
  e.preventDefault();
  try {
    Player.stop();
  } catch (error) {
    executeHostCommand('error', error.message);
  }
}