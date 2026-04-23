import { lessonAudio } from "@/lib/lessonAudio";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useRef } from "react";

export function useLessonAudio(character: string | null) {
  const referencePlayer = useAudioPlayer();
  const recordedPlayer = useAudioPlayer();
  const nextAction = useRef<"reference" | null>(null);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const status = useAudioPlayerStatus(recordedPlayer);
  // ---- Load lesson audio from assets ----
  useEffect(() => {
    if (!character) return;
    const audio = lessonAudio[character];
    if (!audio) {
      return;
    }
    referencePlayer.replace(audio);
    if (shouldPlay.current) {
      referencePlayer.play();
      shouldPlay.current = false;
    }
  }, [character]);

  // for sequential audio
  useEffect(() => {
    if (status.didJustFinish && nextAction.current === "reference") {
      nextAction.current = null;
      playCurrentAudio();
    }
  }, [status.didJustFinish]);

  // ---- Attach audio to player ----
  const shouldPlay = useRef(false);

  // ---- Permissions ----
  useEffect(() => {
    AudioModule.requestRecordingPermissionsAsync();
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  // ---- Controls ----
  const playCurrentAudio = () => {
    if (referencePlayer.isLoaded) {
      referencePlayer.seekTo(0);
      referencePlayer.play();
    } else {
      shouldPlay.current = true; // play once loaded
    }
  };

  const startRecording = async () => {
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: true,
    });
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
    });
  }, []);

  const playRecording = () => {
    nextAction.current = "reference";

    recordedPlayer.seekTo(0);
    recordedPlayer.play();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await recorder.stop();
    if (recorder.uri) {
      recordedPlayer.replace(recorder.uri);
    }
    await setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
    });
    playRecording();
  };

  const playOnLoad = () => {
    if (referencePlayer.isLoaded) {
      referencePlayer.seekTo(0);
      referencePlayer.play();
    } else {
      shouldPlay.current = true;
    }
  };

  return {
    playOnLoad,
    playCurrentAudio,
    startRecording,
    stopRecording,
    playRecording,
    isRecording: recorderState.isRecording,
    hasRecording: !!recorder.uri,
  };
}
