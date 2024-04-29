#include <SDL2/SDL.h>
#include <SDL2/SDL_audio.h>
#include <SDL2/SDL_stdinc.h>
#include <SDL2/SDL_timer.h>
#include <cstdio>
#include <emscripten.h>
#include <emscripten/bind.h>

#include "src/player.h"
#include "src/wrappers.h"

#include "latebit/sid/parser/parser.h"
#include "latebit/sid/synth/track.h"
#include "latebit/sid/synth/tune.h"

using namespace std;
using namespace sid;
using namespace player;
using namespace emscripten;

int main() {
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
      .class_function("preview", &Player::preview)
      .class_function("isPlaying", &Player::isPlaying)
      .class_function("isLooping", &Player::isLooping)
      .class_function("setLoop", &Player::setLoop)
      .class_function("pause", &Player::pause);

  class_<TuneParser>("TuneParser")
      .class_function("fromString", &TuneParser::fromString);

  class_<Tune>("Tune")
      .constructor<int>()
      .function("getBpm", &Tune::getBpm)
      .function("setBpm", &Tune::setBpm)
      .function("getTicksPerBeat", &Tune::getTicksPerBeat)
      .function("setTicksPerBeat", &Tune::setTicksPerBeat)
      .function("getBeatsCount", &Tune::getBeatsCount)
      .function("setBeatsCount", &Tune::setBeatsCount)
      .function("getTracksCount", &Tune::getTracksCount);

  emscripten::function("getNote", &getNote);
  emscripten::function("setNote", &setNote);
  emscripten::function("getTrackSize", &getTrackSize);

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
}