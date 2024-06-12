//@ts-check
import { Sprite } from '../renderer.js';
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
    state.listen('currentFrame', this.handleNewFrame.bind(this));
  },
  handleNewFrame(/** @type {number} */ frame) {
    const sprite = state.getSprite();
    if (!sprite) return;

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
    if (!sprite) return;
    const newFrame = (sprite.getFrameCount() + state.getCurrentFrame() - 1) % sprite.getFrameCount();
    state.setCurrentFrame(newFrame);
  },
  handleNext(/** @type {Event} */ e) {
    e.preventDefault();
    const sprite = state.getSprite();
    if (!sprite) return;
    const newFrame = (state.getCurrentFrame() + 1) % sprite.getFrameCount();
    state.setCurrentFrame(newFrame);
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