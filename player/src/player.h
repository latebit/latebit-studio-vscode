#pragma once

#include "latebit/sid/synth/sequencer.h"
#include <memory>

using namespace sid;

namespace player {
class Player {
private:
  static unsigned long int device;
  static unique_ptr<Sequencer> tuneSequencer;
  static unique_ptr<Sequencer> sfxSequencer;
  static shared_ptr<Tune> sfxTune;

public:
  static void init(unsigned long int device);
  static void callback(void *data, unsigned char *stream, int len);
  static void play(Tune *tune);
  static void pause();
  static Note preview(Symbol symbol);

  static bool isPlaying();
  static bool isLooping();
  static void setLoop(bool loop);
};
} // namespace player