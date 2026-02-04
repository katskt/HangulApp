import { useEffect, useState } from "react";
import { supabase } from "@/supabaseConfig";
import {
  useAudioPlayer,
  useAudioRecorder,
  RecordingPresets,
  setAudioModeAsync,
  AudioModule,
  useAudioRecorderState,
} from "expo-audio";

export function useLessonAudio(character: string | null) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const referencePlayer = useAudioPlayer();
  const recordedPlayer = useAudioPlayer();

  useEffect(() => {
  if (!audioUrl) return;

  (async () => {
    await referencePlayer.replace(audioUrl);
  })();
}, [audioUrl]);


  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);

  // ---- Load lesson audio from Supabase ----
  useEffect(() => {
    if (!character) return;

    const load = async () => {
      const path = `${character}.mp3`;
      const { data } = supabase.storage
        .from("lessonAudio")
        .getPublicUrl(path);

      setAudioUrl(data.publicUrl);

    };

    load();
  }, [character]);

  // ---- Attach audio to player ----
useEffect(() => {
  if (!audioUrl) {
    // nothing to do — player just remains empty
    return;
  }

  referencePlayer.replace(audioUrl);
}, [audioUrl]);

  // ---- Permissions ----
  useEffect(() => {
    AudioModule.requestRecordingPermissionsAsync();
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  // ---- Controls ----
  const playReference = () => {
    if (!referencePlayer.isLoaded) return;
    referencePlayer.seekTo(0);
    referencePlayer.play();
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
  };

  return {
    playReference,
    startRecording,
    stopRecording,
    playRecording: () => {recordedPlayer.seekTo(0); recordedPlayer.play()}, 
    isRecording: recorderState.isRecording,
    hasRecording: !!recorder.uri,
  };
}
