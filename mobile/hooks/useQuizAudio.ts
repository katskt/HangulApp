import { quizAudio } from "@/lib/quizAudio";
import {
  AudioModule,
  setAudioModeAsync,
  useAudioPlayer,
} from "expo-audio";
import { useEffect, useRef } from "react";

export function useQuizAudio() {
  const player = useAudioPlayer();

  // ---- core function ----
  const playAudio = async (character: string | null) => {
    if (character == null) {console.log("character is null, returning"); return};
    const audio = quizAudio[character];

    if (!audio) {
      console.warn("No audio found for:", character);
      return;
    }
    player.replace(audio);
    player.seekTo(0);
    player.play();
  };

  return {
    playAudio,
  };
}