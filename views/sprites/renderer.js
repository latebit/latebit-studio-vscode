//@ts-check

/**
 * @typedef {import('./renderer')} Module
 */

const renderer = window.Module;
const {
  Frame,
  Sprite,
  SpriteParser,
  isSameSprite,
  Color,
} = renderer;

export {
  Frame,
  Sprite,
  SpriteParser,
  isSameSprite,
  Color,
}