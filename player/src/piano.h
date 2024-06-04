#pragma once

#include "latebit/sid/synth/Oscillator.h"
#include "latebit/sid/synth/Sequencer.h"

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