#include "player.h"
#include <SDL2/SDL_audio.h>
#include <latebit/sid/synth/oscillator.h>
#include <latebit/sid/synth/track.h>
#include <memory>

using namespace sid;
using namespace std;

namespace player {
long unsigned int Player::device = 0;
unique_ptr<Sequencer> Player::tuneSequencer = make_unique<Sequencer>();
unique_ptr<Piano> Player::piano = make_unique<Piano>();

void Player::init(unsigned long int device) { Player::device = device; }

float mix(float a, float b) {
  float sum = a + b;
  return (sum == a ? a : (sum == b ? b : sum / 2.0));
}

void Player::callback(void *data, unsigned char *stream, int len) {
  int samples = len / sizeof(float);

  for (int i = 0; i < samples; i++) {
    ((float *)stream)[i] =
        mix(tuneSequencer->getNextSample(), piano->process());
  }
}

// This uses a raw pointer + conversion because emscripten cannot cope with
// smart pointers
void Player::play(Tune *tune) {
  if (tuneSequencer->getCurrentTune().get() != tune) {
    auto shared = shared_ptr<Tune>(tune);
    tuneSequencer->stop();
    tuneSequencer->unloadTune();
    tuneSequencer->loadTune(shared);
  }

  SDL_PauseAudioDevice(device, 0);
  tuneSequencer->play();
}

void Player::pause() {
  SDL_PauseAudioDevice(device, 1);
  tuneSequencer->pause();
}

void Player::stop() {
  SDL_PauseAudioDevice(device, 1);
  tuneSequencer->stop();
}

bool Player::isPlaying() { return tuneSequencer->isPlaying(); };
bool Player::isLooping() { return tuneSequencer->isLooping(); };
void Player::setLoop(bool loop) { tuneSequencer->setLoop(loop); };

Note Player::parse(Symbol symbol) {
  if (symbol.empty() || symbol == END_OF_TRACK_SYMBOL)
    return Note::makeInvalid();
  if (symbol == REST_SYMBOL)
    return Note::makeRest();
  if (symbol == CONTINUE_SYMBOL)
    return Note::makeContinue();

  return Note::fromSymbol(symbol);
}

void Player::playNote(Note note) {
  SDL_PauseAudioDevice(device, 0);
  piano->setNote(note);
}

} // namespace player