//@ts-check
import { state } from '../state.js';

export const $playback = {
  $play: /** @type {HTMLButtonElement} */ (document.getElementById('play')),
  $previous: /** @type {HTMLButtonElement} */ (document.getElementById('previous')),
  $next: /** @type {HTMLButtonElement} */ (document.getElementById('next')),
  $frameCounter: /** @type {HTMLButtonElement} */ (document.getElementById('frame-counter')),

  init() {
    this.$play.disabled = false;
    this.$previous.disabled = false;
    this.$next.disabled = false;

    this.$play.addEventListener('click', this.handlePlay.bind(this));
    this.$previous.addEventListener('click', this.handlePrevious.bind(this));
    this.$next.addEventListener('click', this.handleNext.bind(this));
    state.listen('frameIndex', this.handleNewFrame.bind(this));
  },
  handleNewFrame(/** @type {number} */ frame) {
    const sprite = state.getSprite();
    const total = sprite.getFrameCount().toString();
    const current = (frame + 1).toString().padStart(total.length, '0');
    this.$frameCounter.innerText = `${current} : ${total}`
  },
  handlePlay(/** @type {Event} */ e) {
    e.preventDefault();

    if (loop.isPlaying) {
      this.$play.classList.remove('codicon-debug-pause')
      this.$play.classList.add('codicon-play')
      this.$previous.disabled = false;
      this.$next.disabled = false;
      loop.stop();
    } else {
      this.$play.classList.add('codicon-debug-pause')
      this.$play.classList.remove('codicon-play')
      this.$previous.disabled = true;
      this.$next.disabled = true;
      loop.play();
    }
  },
  handlePrevious(/** @type {Event} */ e) {
    e.preventDefault();
    const sprite = state.getSprite();
    const frameCount = sprite.getFrameCount();
    const index = (frameCount + state.getFrameIndex() - 1) % frameCount;
    state.setFrameIndex(index);
  },
  handleNext(/** @type {Event} */ e) {
    e.preventDefault();
    const sprite = state.getSprite();
    const index = (state.getFrameIndex() + 1) % sprite.getFrameCount();
    state.setFrameIndex(index);
  },
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
      if (time - lastTime > 1000 / 60) {
        lastTime = time;
        currentTick++;

        if (currentTick % sprite.getSlowdown() === 0) {
          currentTick = 0;
          const index = (state.getFrameIndex() + 1) % sprite.getFrameCount();
          state.setFrameIndex(index);
        }
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  },
  stop() {
    loop.isPlaying = false;
  }
}