// hooks/useSoundEffects.ts
import { useAudioPlayer } from "expo-audio";

export function useSoundEffects() {
  const correct1 = useAudioPlayer(
    require("@/assets/audios/correct/correct1.mp3"),
  );
  const correct2 = useAudioPlayer(
    require("@/assets/audios/correct/correct2.mp3"),
  );
  const correct3 = useAudioPlayer(
    require("@/assets/audios/correct/correct3.mp3"),
  );
  const correct4 = useAudioPlayer(
    require("@/assets/audios/correct/correct4.mp3"),
  );
  const wrong1 = useAudioPlayer(require("@/assets/audios/wrong/wrong1.mp3"));
  const wrong2 = useAudioPlayer(require("@/assets/audios/wrong/wrong2.mp3"));
  const wrong3 = useAudioPlayer(require("@/assets/audios/wrong/wrong3.mp3"));
  const wrong4 = useAudioPlayer(require("@/assets/audios/wrong/wrong4.mp3"));

  const congrats1 = useAudioPlayer(
    require("@/assets/audios/congrats/congrats1.mp3"),
  );
  const congrats2 = useAudioPlayer(
    require("@/assets/audios/congrats/congrats2.mp3"),
  );

  const correctSounds = [correct1, correct2, correct3, correct4];
  const wrongSounds = [wrong1, wrong2, wrong3, wrong4];
  const congratsSounds = [congrats1, congrats2];

  const playCorrect = () => {
    const sound =
      correctSounds[Math.floor(Math.random() * correctSounds.length)];
    sound.seekTo(0);
    sound.play();
  };

  const playWrong = () => {
    const sound = wrongSounds[Math.floor(Math.random() * wrongSounds.length)];
    sound.seekTo(0);
    sound.play();
  };

  const playFinished = () => {
    const sound =
      congratsSounds[Math.floor(Math.random() * congratsSounds.length)];
    sound.seekTo(0);
    sound.play();
  };
  return { playCorrect, playWrong, playFinished };
}
// Then in component:
// typescriptconst { playCorrect, playWrong } = useSoundEffects();
