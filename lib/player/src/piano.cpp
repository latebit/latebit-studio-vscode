#include "piano.h"

namespace player {
const int LENGTH_IN_SAMPLES = 8192;

float Piano::process() {
  ticks++;
  if (ticks == LENGTH_IN_SAMPLES)
    e.release();
  return this->o.oscillate() * this->e.process();
}

void Piano::setNote(Note note) {
  this->o.setPitch(note.getPitch());
  this->o.setVolume(note.getVolume());
  this->o.setEffect(note.getEffect());
  this->o.setWave(note.getWave());
  this->e.attack();
  this->ticks = 0;
}
} // namespace player