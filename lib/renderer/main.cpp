#include <cstdio>
#include <emscripten.h>

#include <latebit/core/graphics/SpriteParser.h>

#include <emscripten.h>
#include <emscripten/bind.h>

#include "src/wrappers.cpp"

using namespace lb;
using namespace emscripten;

EMSCRIPTEN_BINDINGS(renderer) {
  class_<SpriteParser>("SpriteParser")
    .class_function("fromString", &SpriteParser::fromString);  

  class_<Sprite>("Sprite")
    .constructor<string, uint8_t, uint8_t, uint8_t, uint8_t>()
    .function("getWidth", &Sprite::getWidth)
    .function("getHeight", &Sprite::getHeight)
    .function("getSlowdown", &Sprite::getSlowdown)
    .function("setWidth", &Sprite::setWidth)
    .function("setHeight", &Sprite::setHeight)
    .function("setSlowdown", &Sprite::setSlowdown)
    .function("addFrame", &Sprite::addFrame)
    .function("getFrame", &Sprite::getFrame)
    .function("getFrameCount", &Sprite::getFrameCount);
  
  emscripten::function("isSameSprite", &isSameSprite);

  register_vector<Color>("Content");

  class_<Frame>("Frame")
    .constructor<>()
    .constructor<uint8_t, uint8_t, vector<Color>>()
    .function("getWidth", &Frame::getWidth)
    .function("getHeight", &Frame::getHeight)
    .function("getContent", &Frame::getContent, allow_raw_pointers());
  
  enum_<Color>("Color")
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