//@ts-check

/**
 * @typedef {import('../../lib/renderer/build/renderer').Keyframe} Keyframe
 * @typedef {import('../../lib/renderer/build/renderer').Sprite} Sprite
 * @typedef {import('../../lib/renderer/build/renderer').SpriteParser} SpriteParser
 * @typedef {import('../../lib/renderer/build/renderer').Color} Color
 * @typedef {import('../../lib/renderer/build/renderer').Keyframes} Keyframes
 * @typedef {import('../../lib/renderer/build/renderer').MainModule} Renderer
 */

// @ts-expect-error embind does not attach module to window
const renderer = /** @type {Renderer} */ (window.Module);

export const Keyframe = /** @type {Keyframe & Renderer['Keyframe']} */ (renderer.Keyframe);
export const Sprite = /** @type {Sprite & Renderer['Sprite']} */ (renderer.Sprite);
export const SpriteParser = /** @type {Renderer['SpriteParser']} */ (renderer.SpriteParser);
export const Color = /** @type {Renderer['Color']} */ (renderer.Color);
export const Keyframes = /** @type {Renderer['Keyframes']} */ (renderer.Keyframes);

// Wrapper functions
export const isSameSprite = /** @type {Renderer['isSameSprite']} */ (renderer.isSameSprite);
export const setSize = /** @type {Renderer['setSize']} */ (renderer.setSize);
export const setDuration = /** @type {Renderer['setDuration']} */ (renderer.setDuration);
export const setFrameCount = /** @type {Renderer['setFrameCount']} */ (renderer.setFrameCount);
export const setFrame = /** @type {Renderer['setFrame']} */ (renderer.setFrame);
