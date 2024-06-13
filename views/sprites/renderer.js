//@ts-check

/**
 * @typedef {import('../../lib/renderer/build/renderer').Frame} Frame
 * @typedef {import('../../lib/renderer/build/renderer').Sprite} Sprite
 * @typedef {import('../../lib/renderer/build/renderer').SpriteParser} SpriteParser
 * @typedef {import('../../lib/renderer/build/renderer').Color} Color
 * @typedef {import('../../lib/renderer/build/renderer').MainModule} Renderer
 */

// @ts-expect-error embind does not attach module to window
const renderer = /** @type {Renderer} */ (window.Module);

export const Frame = /** @type {Frame & Renderer['Frame']} */ (renderer.Frame);
export const Sprite = /** @type {Sprite & Renderer['Sprite']} */ (renderer.Sprite);
export const SpriteParser = /** @type {Renderer['SpriteParser']} */ (renderer.SpriteParser);
export const Color = /** @type {Renderer['Color']} */ (renderer.Color);
export const isSameSprite = /** @type {Renderer['isSameSprite']} */ (renderer.isSameSprite);
