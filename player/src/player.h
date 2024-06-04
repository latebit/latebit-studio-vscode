#pragma once

#include "latebit/sid/synth/Sequencer.h"
#include "piano.h"
#include <memory>

using namespace sid;

namespace player {
class Player {
private:
  static unsigned long int device;
  static unique_ptr<Sequencer> tuneSequencer;
  static unique_ptr<Piano> piano;

public:
  static void init(unsigned long int device);
  static void callback(void *data, unsigned char *stream, int len);
  static void play(Tune *tune);
  static void pause();
  static void stop();
  static Note parse(Symbol symbol);

  static bool isPlaying();
  static bool isLooping();
  static void setLoop(bool loop);
  static void playNote(Note note);
};
} // namespace player