#include <latebit/core/graphics/Sprite.h>
#include <memory>

using namespace lb;

namespace renderer {
  auto isSameSprite(const Sprite &a, const Sprite &b) -> bool {
    return a == b;
  };

  auto setSize(const Sprite &sprite, uint8_t width, uint8_t height) -> unique_ptr<Sprite> {
    auto newSprite = make_unique<Sprite>(sprite.getLabel(), width, height, sprite.getSlowdown(), sprite.getFrameCount());

    for (int i = 0; i < sprite.getFrameCount(); i++) {
      auto frame = sprite.getFrame(i);
      auto content = vector<Color>(width * height, Color::UNDEFINED_COLOR);

      for (int y = 0; y < frame.getHeight(); y++) {
        for (int x = 0; x < frame.getWidth(); x++) {
          content[y * width + x] = frame.getContent()[y * frame.getWidth() + x];
        }
      }

      newSprite->addFrame(Frame(width, height, content));
    }

    delete &sprite;
    return newSprite;
  };

  auto setSlowdown(Sprite &sprite, uint8_t slowdown) -> unique_ptr<Sprite> {
    auto newSprite = make_unique<Sprite>(sprite.getLabel(), sprite.getWidth(), sprite.getHeight(), slowdown, sprite.getFrameCount());

    for (int i = 0; i < sprite.getFrameCount(); i++) {
      newSprite->addFrame(sprite.getFrame(i));
    }

    delete &sprite;
    return newSprite;
  };

  auto setFrameCount(Sprite &sprite, uint8_t frameCount) -> unique_ptr<Sprite> {
    auto newSprite = make_unique<Sprite>(sprite.getLabel(), sprite.getWidth(), sprite.getHeight(), sprite.getSlowdown(), frameCount);
    auto maxFrameCount = frameCount < sprite.getFrameCount() ? frameCount : sprite.getFrameCount();

    for (int i = 0; i < maxFrameCount; i++) {
      newSprite->addFrame(sprite.getFrame(i));
    }

    for (int i = maxFrameCount; i < frameCount; i++) {
      newSprite->addFrame(Frame(sprite.getWidth(), sprite.getHeight(), vector<Color>(sprite.getWidth() * sprite.getHeight(), Color::UNDEFINED_COLOR)));
    }

    delete &sprite;
    return newSprite;
  };
}