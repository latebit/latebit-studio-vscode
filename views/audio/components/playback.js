//@ts-check
import { executeHostCommand, Command } from '../../ipc.js';
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
    this.$play.disabled = false;
    this.$loop.disabled = false;
    this.$stop.disabled = false;
    this.$play.addEventListener('click', handleClickPlay);
    this.$stop.addEventListener('click', handleClickStop);
    this.$loop.addEventListener('click', handleToggleLoop);
    handlePlayingIcon();
  }
}

const handleToggleLoop = (e) => {
  e.preventDefault();
  const checked = e.target.hasAttribute('data-checked')
  if (checked) {
    e.target.removeAttribute('data-checked');
    e.target.classList.add('codicon-sync-ignored');
    e.target.classList.remove('codicon-sync');
  } else {
    e.target.setAttribute('data-checked', '');
    e.target.classList.add('codicon-sync');
    e.target.classList.remove('codicon-sync-ignored');
  }

  Player.setLoop(!checked);
};

const handleClickPlay = (e) => {
  e.preventDefault();
  try {
    if (Player.isPlaying()) {
      return Player.pause();
    }
    const tune = state.getTune();
    if (!tune) {
      executeHostCommand(Command.Error, 'No tune to play');
      return;
    }
    Player.play(tune);
  } catch (e) {
    executeHostCommand(Command.Error, e.message);
  }
}

const handleClickStop = (e) => {
  e.preventDefault();
  try {
    Player.stop();
  } catch (error) {
    executeHostCommand(Command.Error, error.message);
  }
}

const handlePlayingIcon = () => {
  const loop = () => {
    if (Player.isPlaying()) {
      $playback.$play.classList.remove('codicon-play');
      $playback.$play.classList.add('codicon-debug-pause');
    } else {
      $playback.$play.classList.remove('codicon-debug-pause');
      $playback.$play.classList.add('codicon-play');
    }
    requestAnimationFrame(loop);
  }
  loop();
}