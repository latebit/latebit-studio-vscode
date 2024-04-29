import { executeHostCommand } from '../ipc.js';
import { state } from '../state.js';

export const $playback = {
  $play: document.getElementById('play'),
  $loop: document.getElementById('loop'),
  $stop: document.getElementById('stop'),
  init() {
    this.$play.disabled = true;
    this.$stop.disabled = true;
    this.$play.addEventListener('click', handleClickPlay);
    this.$stop.addEventListener('click', handleClickStop);
    this.$loop.addEventListener('change', handleToggleLoop);
  }
}

const handleToggleLoop = (e) => Module.Player.setLoop(e.target.checked);
const handleClickPlay = (e) => {
  e.preventDefault();
  try {
    if (Module.Player.isPlaying()) {
      Module.Player.pause();
    } else {
      Module.Player.play(state.getTune());
    }
  } catch (e) {
    executeHostCommand('error', e.message);
  }
}

const handleClickStop = (e) => {
  e.preventDefault();
  try {
    Module.Player.stop();
  } catch (e) {
    executeHostCommand('error', e.message);
  }
}