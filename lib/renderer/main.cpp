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
  Log.setDestination(lb::STDOUT);

  emscripten::class_<SpriteParser>("SpriteParser")
    .class_function("fromString", &SpriteParser::fromString)
    .class_function("toString", &SpriteParser::toString);

  emscripten::class_<Sprite>("Sprite")
    .constructor<string, uint8_t, uint8_t, uint8_t, uint8_t>()
    .function("getWidth", &Sprite::getWidth)
    .function("getHeight", &Sprite::getHeight)
    .function("getSlowdown", &Sprite::getSlowdown)
    .function("addFrame", &Sprite::addFrame)
    .function("getFrame", &Sprite::getFrame)
    .function("setFrame", &Sprite::setFrame)
    .function("getFrameCount", &Sprite::getFrameCount);
  
  emscripten::function("isSameSprite", &renderer::isSameSprite);
  emscripten::function("setSize", &renderer::setSize);
  emscripten::function("setFrameCount", &renderer::setFrameCount);
  emscripten::function("setSlowdown", &renderer::setSlowdown);

  emscripten::register_vector<Color>("Content");

  emscripten::class_<Frame>("Frame")
    .constructor<>()
    .constructor<uint8_t, uint8_t, vector<Color>>()
    .function("getWidth", &Frame::getWidth)
    .function("getHeight", &Frame::getHeight)
    .function("getContent", &Frame::getContent, emscripten::allow_raw_pointers());
  
  emscripten::enum_<Color>("Color")
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