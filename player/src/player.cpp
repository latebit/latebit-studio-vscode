#include "player.h"
#include "latebit/sid/parser/symbol.h"
#include "latebit/sid/synth/track.h"
#include <SDL2/SDL_audio.h>
#include <memory>

using namespace sid;
using namespace std;

namespace player {
long unsigned int Player::device = 0;
unique_ptr<Sequencer> Player::tuneSequencer = make_unique<Sequencer>();
unique_ptr<Sequencer> Player::sfxSequencer = make_unique<Sequencer>();
shared_ptr<Tune> Player::sfxTune = make_shared<Tune>(1);

void Player::init(unsigned long int device) {
  Player::device = device;

  sfxTune->setBeatsCount(1);
  sfxTune->setBpm(60);
  sfxTune->setTicksPerBeat(1);
  sfxTune->getTrack(0)->push_back(Note::rest());
}

float mix(float a, float b) {
  float sum = a + b;
  return (sum == a ? a : (sum == b ? b : sum / 2.0));
}

void Player::callback(void *data, unsigned char *stream, int len) {
  int samples = len / sizeof(float);

  for (int i = 0; i < samples; i++) {
    auto sfxSample = sfxSequencer->getNextSample();
    ((float *)stream)[i] = mix(tuneSequencer->getNextSample(), sfxSample);
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

bool Player::isPlaying() { return tuneSequencer->isPlaying(); };
bool Player::isLooping() { return tuneSequencer->isLooping(); };
void Player::setLoop(bool loop) { tuneSequencer->setLoop(loop); };

void Player::preview(string symbol) {
  printf("preview\n");
  if (isRest(symbol) || isContinue(symbol) || isEndOfTrack(symbol)) {
    printf("returning\n");
    return;
  }
  auto n = toNote(symbol);
  auto tune = make_shared<Tune>(1);
  tune->setBeatsCount(1);
  tune->setBpm(60);
  tune->setTicksPerBeat(1);
  tune->getTrack(0)->push_back(n);
  sfxSequencer->unloadTune();
  sfxSequencer->loadTune(tune);

  SDL_PauseAudioDevice(device, 0);
  sfxSequencer->play();
}

} // namespace player