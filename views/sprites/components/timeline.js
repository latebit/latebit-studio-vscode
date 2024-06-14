// @ts-check
import { Sprite } from '../renderer.js'
import { state } from '../state.js'
import { frameManager } from '../frame.js'

export const $timeline = {
  $root: /** @type {HTMLElement} */ (document.getElementById('timeline')),
  init() {
    state.listen('sprite', (sprite) => {
      this.renderFrames(sprite)
      this.highlightFrameAt(state.getFrameIndex())
    })
    state.listen('frameIndex', this.highlightFrameAt.bind(this))
  },
  highlightFrameAt(/** @type {number} */ frame) {
    for (const $sprite of this.$root.childNodes) {
      if (!($sprite instanceof HTMLElement)) continue;

      if ($sprite.dataset.index == frame.toString()) {
        $sprite.classList.add('selected');
        // Allow always having the highlighted element in view
        $sprite.scrollIntoView(false);
      } else {
        $sprite.classList.remove('selected');
      }
    }
  },
  renderFrames(/** @type {Sprite} */ sprite) {
    this.$root.innerHTML = '';
    const count = sprite.getFrameCount();
    for (let i = 0; i < count; i++) {
      const $frame = document.createElement('div');
      $frame.classList.add('frame');
      $frame.setAttribute("data-index", i.toString());
      $frame.addEventListener('click', (e) => {
        e.preventDefault();
        state.setFrameIndex(i);
      })

      const $canvas = frameManager.getFrame(i);
      if (!$canvas) continue;

      $canvas.style.height = '80px';
      $canvas.style.width = 'unset';

      if (count > 1) {
        const $remove = document.createElement('button');
        $remove.classList.add('codicon', 'codicon-close')
        $remove.addEventListener('click', () => {
          const newSprite = new Sprite("", sprite.getHeight(), sprite.getWidth(), sprite.getSlowdown(), count - 1);
          for (let j = 0; j < count; j++) {
            if (j != i) newSprite.addFrame(sprite.getFrame(j))
          }
          state.setSprite(newSprite);
          sprite.delete();
        })
        $frame.appendChild($remove)
      }

      const $label = document.createElement('span');
      $label.innerText = `${i + 1}`

      $frame.appendChild($canvas)
      $frame.appendChild($label)
      this.$root.appendChild($frame);
    }
  }
}