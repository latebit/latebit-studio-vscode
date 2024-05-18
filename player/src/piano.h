#pragma once

#include "latebit/sid/synth/oscillator.h"
#include "latebit/sid/synth/sequencer.h"

using namespace sid;

namespace player {
class Piano {
private:
  Oscillator o = Oscillator(1000);
  Envelope e = Envelope();
  long int ticks = 0;

public:
  Piano() = default;

  void setNote(Note note);
  float process();
};
} // namespace player