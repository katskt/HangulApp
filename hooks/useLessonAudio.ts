import { supabase } from "@/supabaseConfig";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";

export function useLessonAudio(character: string | null) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const referencePlayer = useAudioPlayer();
  const recordedPlayer = useAudioPlayer();

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  // ---- Load lesson audio from Supabase ----
  useEffect(() => {
    if (!character) return;

    const load = async () => {
      const path = `${character}.mp3`;
      const { data } = supabase.storage.from("lessonAudio").getPublicUrl(path);

      setAudioUrl(data.publicUrl);
    };

    load();
  }, [character]);

  // ---- Attach audio to player ----
  const shouldPlay = useRef(false);

  useEffect(() => {
    if (!audioUrl) return;
    referencePlayer.replace(audioUrl);
    if (shouldPlay.current) {
      referencePlayer.play();
      shouldPlay.current = false;
    }
  }, [audioUrl]);

  // ---- Permissions ----
  useEffect(() => {
    AudioModule.requestRecordingPermissionsAsync();
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  // ---- Controls ----
  const playReference = () => {
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

  const playRecording = async () => {
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
    shouldPlay.current = true;
  };

  return {
    playOnLoad,
    playReference,
    startRecording,
    stopRecording,
    playRecording,
    isRecording: recorderState.isRecording,
    hasRecording: !!recorder.uri,
  };
}
