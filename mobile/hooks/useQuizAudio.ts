import { quizAudio } from "@/lib/quizAudio";
import {
  AudioModule,
  setAudioModeAsync,
  useAudioPlayer,
} from "expo-audio";
import { useEffect, useRef } from "react";

export function useQuizAudio() {
  const player = useAudioPlayer();
  const shouldPlay = useRef(false);

  // ---- permissions (run once) ----
  useEffect(() => {
    AudioModule.requestRecordingPermissionsAsync();
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  // ---- core function ----
  const playAudio = (character: string | null) => {
    if (character == null) return;
    const audio = quizAudio[character];

    if (!audio) {
      console.warn("No audio found for:", character);
      return;
    }

    // If already loaded → restart and play
    if (player.isLoaded) {
      player.replace(audio);
      player.seekTo(0);
      player.play();
    } else {
      // fallback if not ready yet
      shouldPlay.current = true;
      player.replace(audio);
    }
  };

  return {
    playAudio,
  };
}