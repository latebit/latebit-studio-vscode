#include <latebit/core/graphics/Keyframe.h>
#include <latebit/core/graphics/Sprite.h>
#include <memory>

using namespace lb;

namespace renderer {
  auto isSameSprite(const Sprite &a, const Sprite &b) -> bool {
    return a == b;
  };

  auto setSize(const Sprite &sprite, uint8_t width, uint8_t height) -> unique_ptr<Sprite> {
    auto frames = vector<Keyframe>();
    frames.reserve(sprite.getFrameCount());

    for (uint8_t i = 0; i < sprite.getFrameCount(); i++) {
      auto frame = sprite.getFrame(i);
      auto content = vector<Color::Color>(width * height, Color::UNDEFINED_COLOR);

      for (uint8_t y = 0; y < sprite.getHeight(); y++) {
        for (uint8_t x = 0; x < sprite.getWidth(); x++) {
          content[y * width + x] = frame[y * sprite.getWidth() + x];
        }
      }

      frames.push_back(content);
    }

    auto newSprite = make_unique<Sprite>(sprite.getLabel(), width, height, sprite.getDuration(), frames);
    delete &sprite;
    return newSprite;
  };

  auto setDuration(Sprite &sprite, uint8_t slowdown) -> unique_ptr<Sprite> {
    auto frames = vector<Keyframe>();
    frames.reserve(sprite.getFrameCount());

    for (uint8_t i = 0; i < sprite.getFrameCount(); i++) {
      frames.push_back(sprite.getFrame(i));
    }

    auto newSprite = make_unique<Sprite>(sprite.getLabel(), sprite.getWidth(), sprite.getHeight(), slowdown, frames);
    delete &sprite;
    return newSprite;
  };

  auto setFrameCount(Sprite &sprite, uint8_t frameCount) -> unique_ptr<Sprite> {
    auto maxFrameCount = frameCount < sprite.getFrameCount() ? frameCount : sprite.getFrameCount();
    auto frames = vector<Keyframe>();
    frames.reserve(frameCount);

    for (uint8_t i = 0; i < maxFrameCount; i++) {
      frames.push_back(sprite.getFrame(i));
    }

    for (uint8_t i = maxFrameCount; i < frameCount; i++) {
      frames.push_back(vector<Color::Color>(sprite.getWidth() * sprite.getHeight(), Color::UNDEFINED_COLOR));
    }

    auto newSprite = make_unique<Sprite>(sprite.getLabel(), sprite.getWidth(), sprite.getHeight(), sprite.getDuration(), frames);
    delete &sprite;
    return newSprite;
  };

  auto setFrame(Sprite &sprite, uint8_t index, const Keyframe &frame) -> unique_ptr<Sprite> {
    auto frames = vector<Keyframe>();
    frames.reserve(sprite.getFrameCount());

    for (uint8_t i = 0; i < sprite.getFrameCount(); i++) {
      if (i == index) {
        frames.push_back(frame);
      } else {
        frames.push_back(sprite.getFrame(i));
      }
    }

    auto newSprite = make_unique<Sprite>(sprite.getLabel(), sprite.getWidth(), sprite.getHeight(), sprite.getDuration(), frames);
    delete &sprite;
    return newSprite;
  };
}