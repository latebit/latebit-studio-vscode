declare global {
  interface Window {
    Module: typeof Module;
  }
}

declare namespace Module {
  interface Vector<T> {
    get(index: number): Item<T>;
    push_back(value: T): void;
    size(): number;
  }

  interface Item<T> { value: T }

  class SpriteParser {
    static fromString(str: string, label: string): Sprite;
  }

  class Sprite {
    constructor(label: string, width: number, height: number, slowdown: number, frameCount: number);
    getWidth(): number;
    setWidth(width: number): void;
    getHeight(): number;
    setHeight(height: number): void;
    getSlowdown(): number;
    setSlowdown(slowdown: number): void;
    addFrame(frame: Frame): void;
    getFrame(index: number): Frame;
    getFrameCount(): number;
  }

  class Frame {
    constructor();
    constructor(width: number, height: number, data: Color[]);
    getWidth(): number;
    getHeight(): number;
    getContent(): Vector<Color>;
  }

  type Color = {
    UNDEFINED_COLOR: Item<-1>,
    BLACK: Item<0>,
    DARK_BLUE: Item<1>,
    DARK_PURPLE: Item<2>,
    DARK_GREEN: Item<3>,
    BROWN: Item<4>,
    DARK_GRAY: Item<5>,
    LIGHT_GRAY: Item<6>,
    WHITE: Item<7>,
    RED: Item<8>,
    ORANGE: Item<9>,
    YELLOW: Item<10>,
    GREEN: Item<11>,
    BLUE: Item<12>,
    INDIGO: Item<13>,
    PINK: Item<14>,
    PEACH: Item<15>,
  };
  const Color: Color;

  function isSameSprite(sprite1: Sprite, sprite2: Sprite): boolean;
}

export = Module;
export as namespace sid;