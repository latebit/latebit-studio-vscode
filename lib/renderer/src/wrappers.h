#pragma once
#include <latebit/core/graphics/Sprite.h>
#include <memory>

using namespace lb;

namespace renderer {
  // Wraps the == operatos which is not available in JavaScript
  auto isSameSprite(const Sprite &a, const Sprite &b) -> bool;

  // Resizes all the frames of a sprite
  auto setSize(const Sprite &sprite, uint8_t width, uint8_t height) -> unique_ptr<Sprite>;

  // Updates the duration of a sprite
  auto setDuration(Sprite &sprite, uint8_t slowdown) -> unique_ptr<Sprite>;

  // Updates the frame count of a sprite
  auto setFrameCount(Sprite &sprite, uint8_t frameCount) -> unique_ptr<Sprite>;

  // Updates the duration of a sprite
  auto setFrame(Sprite &sprite, uint8_t index, const Keyframe &frame) -> unique_ptr<Sprite>;
}
