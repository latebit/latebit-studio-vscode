//@ts-check
import { Sprite } from '../renderer.js';
import { state } from '../state.js';

export const $playback = {
  $play: /** @type {HTMLButtonElement} */ (document.getElementById('play')),

  init() {
    this.$play.disabled = false;
    this.$play.addEventListener('click', this.handleClick.bind(this));
  },
  handleClick(/** @type {Event} */ e) {
    e.preventDefault();

    if (loop.isPlaying) {
      this.$play.classList.remove('codicon-debug-pause')
      this.$play.classList.add('codicon-play')
      loop.stop();
    } else {
      this.$play.classList.add('codicon-debug-pause')
      this.$play.classList.remove('codicon-play')
      loop.play();
    }
  }
}

const loop = {
  isPlaying: false,
  play() {
    let lastTime = 0;
    let currentTick = 0;

    const sprite = state.getSprite();
    if (sprite == null) return;

    loop.isPlaying = true;
    const animate = (/** @type {number} */ time) => {
      if (!loop.isPlaying) return;

      lastTime = time;
      currentTick++;

      if (currentTick % sprite.getSlowdown() === 0) {
        currentTick = 0;
        const newFrame = (state.getCurrentFrame() + 1) % sprite.getFrameCount();
        state.setCurrentFrame(newFrame);
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  },
  stop() {
    loop.isPlaying = false;
  }
}