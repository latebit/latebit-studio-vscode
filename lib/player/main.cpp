#include <SDL2/SDL.h>
#include <SDL2/SDL_audio.h>
#include <SDL2/SDL_stdinc.h>
#include <SDL2/SDL_timer.h>
#include <cstdio>
#include <emscripten.h>
#include <emscripten/bind.h>

#include "src/piano.h"
#include "src/player.h"
#include "src/wrappers.h"

#include "latebit/sid/parser/TuneParser.h"
#include "latebit/sid/synth/Note.h"
#include "latebit/sid/synth/Tune.h"
#include "latebit/utils/Logger.h"
#include "latebit/core/audio/Music.h"
#include "latebit/core/audio/Sound.h"

using namespace std;
using namespace sid;
using namespace player;
using namespace emscripten;

int main() {
  Log.setDestination(lb::STDOUT);
  if (0 != SDL_Init(SDL_INIT_AUDIO | SDL_INIT_EVENTS)) {
    printf("Cannot initialize audio.");
    return 1;
  }
  SDL_AudioSpec spec = {.freq = 44100,
                        .format = AUDIO_F32,
                        .channels = 1,
                        .samples = 4096,
                        .callback = Player::callback};
  SDL_AudioSpec obtained;
  unsigned long int device = SDL_OpenAudioDevice(NULL, 0, &spec, &obtained, 1);

  if (device == 0) {
    printf("Cannot open audio device: %s\n", SDL_GetError());
    return 1;
  }

  Configuration::setSampleRate(obtained.freq);
  Player::init(device);

  emscripten_set_main_loop(
      []() {
        SDL_Event e;
        while (SDL_PollEvent(&e)) {
          switch (e.type) {
          case SDL_QUIT:
            break;
          }
        }
      },
      0, 1);
  emscripten_set_main_loop_timing(EM_TIMING_RAF, 33);
}

EMSCRIPTEN_BINDINGS(sid) {
  class_<Player>("Player")
      .class_function("play", &Player::play, allow_raw_pointers())
      .class_function("parse", &Player::parse)
      .class_function("isPlaying", &Player::isPlaying)
      .class_function("isLooping", &Player::isLooping)
      .class_function("setLoop", &Player::setLoop)
      .class_function("pause", &Player::pause)
      .class_function("stop", &Player::stop)
      .class_function("playNote", &Player::playNote);

  class_<ParserOptions>("ParserOptions")
    .constructor<>()
    .property("maxTracksCount", &ParserOptions::maxTracksCount)
    .property("maxBeatsCount", &ParserOptions::maxBeatsCount)
    .property("maxTicksPerBeat", &ParserOptions::maxTicksPerBeat);

  class_<TuneParser>("TuneParser")
      .class_function("fromString", &TuneParser::fromString, allow_raw_pointers())
      .class_function("toString", &TuneParser::toString, allow_raw_pointers());

  class_<Tune>("Tune")
      .function("getBpm", &Tune::getBpm)
      .function("getTicksPerBeat", &Tune::getTicksPerBeat)
      .function("getBeatsCount", &Tune::getBeatsCount)
      .function("getTracksCount", &Tune::getTracksCount);

  emscripten::function("setNote", &setNote, allow_raw_pointers());
  emscripten::function("getNote", &getNote, allow_raw_pointers());
  emscripten::function("getTrackSize", &getTrackSize, allow_raw_pointers());
  emscripten::function("removeNote", &removeNote, allow_raw_pointers());
  emscripten::function("setBpm", &setBpm, allow_raw_pointers());
  emscripten::function("setTicksPerBeat", &setTicksPerBeat, allow_raw_pointers());
  emscripten::function("setBeatsCount", &setBeatsCount, allow_raw_pointers());
  emscripten::function("setTracksCount", &setTracksCount, allow_raw_pointers());
  emscripten::function("createEmptyTune", &createEmptyTune, allow_raw_pointers());

  class_<Note>("Note")
      .class_function("makeRest", &Note::makeRest)
      .class_function("fromSymbol", &Note::fromSymbol)
      .function("isRest", &Note::isRest)
      .function("isEqual", &Note::isEqual)
      .function("isInvalid", &Note::isInvalid)
      .function("isContinue", &Note::isContinue)
      .function("getPitch", &Note::getPitch)
      .function("getVolume", &Note::getVolume)
      .function("getWave", &Note::getWave)
      .function("getEffect", &Note::getEffect)
      .function("getId", &Note::getId)
      .function("getSymbol", &Note::getSymbol);

  enum_<WaveType>("WaveType")
      .value("TRIANGLE", WaveType::TRIANGLE)
      .value("SQUARE", WaveType::SQUARE)
      .value("SAWTOOTH", WaveType::SAWTOOTH)
      .value("NOISE", WaveType::NOISE);

  enum_<EffectType>("EffectType")
      .value("NONE", EffectType::NONE)
      .value("SLIDE", EffectType::SLIDE)
      .value("DROP", EffectType::DROP)
      .value("FADEIN", EffectType::FADEIN)
      .value("FADEOUT", EffectType::FADEOUT);
  
  constant("MUSIC_PARSER_OPTIONS", lb::MUSIC_PARSER_OPTIONS);
  constant("SOUND_PARSER_OPTIONS", lb::SOUND_PARSER_OPTIONS);
}