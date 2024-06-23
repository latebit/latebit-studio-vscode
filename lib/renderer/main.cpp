#include <cstdio>
#include <emscripten.h>

#include <latebit/core/graphics/SpriteParser.h>
#include <latebit/utils/Logger.h>

#include <emscripten.h>
#include <emscripten/bind.h>

#include "src/wrappers.h"

using namespace lb;
using namespace renderer;

EMSCRIPTEN_BINDINGS(renderer) {
  Log.setDestination(LogDestination::STDOUT);

  emscripten::class_<SpriteParser>("SpriteParser")
    .class_function("fromString", &SpriteParser::fromString)
    .class_function("toString", &SpriteParser::toString);

  emscripten::class_<Sprite>("Sprite")
    .constructor<string, uint8_t, uint8_t, uint8_t, vector<Keyframe>>()
    .function("getWidth", &Sprite::getWidth)
    .function("getHeight", &Sprite::getHeight)
    .function("getDuration", &Sprite::getDuration)
    .function("getFrame", &Sprite::getFrame)
    .function("getFrameCount", &Sprite::getFrameCount);
  
  emscripten::function("isSameSprite", &renderer::isSameSprite);
  emscripten::function("setSize", &renderer::setSize);
  emscripten::function("setFrameCount", &renderer::setFrameCount);
  emscripten::function("setDuration", &renderer::setDuration);
  emscripten::function("setFrame", &renderer::setFrame);

  emscripten::register_vector<Color::Color>("Content");
  emscripten::register_vector<Keyframe>("Keyframes");

  emscripten::class_<Keyframe>("Keyframe")
    .constructor<>()
    .constructor<uint8_t, uint8_t, vector<Color::Color>>()
    .function("getWidth", &Keyframe::getWidth)
    .function("getHeight", &Keyframe::getHeight)
    .function("getContent", &Keyframe::getContent, emscripten::allow_raw_pointers());
  
  emscripten::enum_<Color::Color>("Color")
    .value("UNDEFINED_COLOR", Color::UNDEFINED_COLOR)
    .value("BLACK", Color::BLACK)
    .value("DARK_BLUE", Color::DARK_BLUE)
    .value("DARK_PURPLE", Color::DARK_PURPLE)
    .value("DARK_GREEN", Color::DARK_GREEN)
    .value("BROWN", Color::BROWN)
    .value("DARK_GRAY", Color::DARK_GRAY)
    .value("LIGHT_GRAY", Color::LIGHT_GRAY)
    .value("WHITE", Color::WHITE)
    .value("RED", Color::RED)
    .value("ORANGE", Color::ORANGE)
    .value("YELLOW", Color::YELLOW)
    .value("GREEN", Color::GREEN)
    .value("BLUE", Color::BLUE)
    .value("INDIGO", Color::INDIGO)
    .value("PINK", Color::PINK)
    .value("PEACH", Color::PEACH);
}