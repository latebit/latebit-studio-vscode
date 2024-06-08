#include "wrappers.h"

#include <sstream>
#include "latebit/sid/synth/Tune.h"

using namespace sid;

namespace player {

auto getNote(Tune &tune, int trackIndex, int noteIndex) -> Note {
  return tune.getTrack(trackIndex)->at(noteIndex);
}

auto getTrackSize(Tune &tune, int trackIndex) -> int {
  return tune.getTrack(trackIndex)->size();
}

auto setNote(Tune &tune, int trackIndex, int noteIndex,
             const Note &note) -> unique_ptr<Tune> {
  vector<unique_ptr<Track>> tracks = {};

  for (int i = 0; i < tune.getTracksCount(); i++) {
    tracks.push_back(std::make_unique<Track>(*tune.getTrack(i)));
  }

  auto track = tracks.at(trackIndex).get();

  for (int i = track->size(); i <= noteIndex; i++) {
    track->push_back(Note::makeRest());
  }

  track->at(noteIndex) = note;

  return make_unique<Tune>(tune.getBpm(), tune.getTicksPerBeat(), tune.getBeatsCount(), std::move(tracks));
}

auto removeNote(Tune &tune, int trackIndex, int noteIndex) -> unique_ptr<Tune> {
  vector<unique_ptr<Track>> tracks = {};
  for (int i = 0; i < tune.getTracksCount(); i++) {
    tracks.push_back(std::make_unique<Track>(*tune.getTrack(i)));
  }

  auto track = tracks.at(trackIndex).get();
  track->erase(track->begin() + noteIndex);

  return make_unique<Tune>(tune.getBpm(), tune.getTicksPerBeat(), tune.getBeatsCount(), std::move(tracks));
}

auto setBpm(Tune &tune, int bpm) -> unique_ptr<Tune> {
  vector<unique_ptr<Track>> tracks = {};
  for (int i = 0; i < tune.getTracksCount(); i++) {
    tracks.push_back(std::make_unique<Track>(*tune.getTrack(i)));
  }

  return make_unique<Tune>(bpm, tune.getTicksPerBeat(), tune.getBeatsCount(), std::move(tracks));
}

auto setTicksPerBeat(Tune &tune, int ticksPerBeat) -> unique_ptr<Tune> {
  vector<unique_ptr<Track>> tracks = {};
  for (int i = 0; i < tune.getTracksCount(); i++) {
    tracks.push_back(std::make_unique<Track>(*tune.getTrack(i)));
  }

  return make_unique<Tune>(tune.getBpm(), ticksPerBeat, tune.getBeatsCount(), std::move(tracks));
}

auto setBeatsCount(Tune &tune, int beatsCount) -> unique_ptr<Tune> {
  vector<unique_ptr<Track>> tracks = {};
  for (int i = 0; i < tune.getTracksCount(); i++) {
    tracks.push_back(std::make_unique<Track>(*tune.getTrack(i)));
  }

  return make_unique<Tune>(tune.getBpm(), tune.getTicksPerBeat(), beatsCount, std::move(tracks));
}

auto setTracksCount(Tune &tune, int count) -> unique_ptr<Tune> {
  const int currentCount = tune.getTracksCount();
  
  vector<unique_ptr<Track>> tracks = {};
  for (int i = 0; i < min(count, currentCount); i++) {
    tracks.push_back(make_unique<Track>(*tune.getTrack(i)));
  }

  for (int i = 0; i < count - currentCount; i++) {
    tracks.push_back(make_unique<Track>());
  }

  return make_unique<Tune>(tune.getBpm(), tune.getTicksPerBeat(), tune.getBeatsCount(), std::move(tracks));
}

auto symbolFromPitch(int pitch, WaveType wave) -> Symbol {
  int note = pitch % 12;
  int octave = int(pitch / 12);

  stringstream ss;
  switch (note) {
    case 0: ss << "C-"; break;
    case 1: ss << "C#"; break;
    case 2: ss << "D-"; break;
    case 3: ss << "D#"; break;
    case 4: ss << "E-"; break;
    case 5: ss << "F-"; break;
    case 6: ss << "F#"; break;
    case 7: ss << "G-"; break;
    case 8: ss << "G#"; break;
    case 9: ss << "A-"; break;
    case 10: ss << "A#"; break;
    case 11: ss << "B-"; break;
    default: ss << "--";
  }

  ss << octave;
  ss << wave;
  ss << "--";

  return ss.str();
}

auto pitchFromSymbol(Symbol sym) -> int {
  return Note::fromSymbol(sym).getPitch();
}

auto createEmptyTune(int bpm, int ticksPerBeat, int beatsCount, int tracksCount) -> unique_ptr<Tune> {
  std::vector<std::unique_ptr<Track>> tracks;
  for (int i = 0; i < tracksCount; i++) {
      tracks.push_back(std::make_unique<Track>());
  }

  return make_unique<Tune>(bpm, ticksPerBeat, beatsCount, std::move(tracks));
}

} // namespace player