import HalfSplashTemplate from "@/components/LessonBackgroundScreen";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../../../supabaseConfig"; // your supabase client
import Icon from "react-native-vector-icons/Ionicons";
const referenceAudio = require("../../../../assets/audios/eu.mp3");
import { usePathname, useRouter } from "expo-router";
import MyButton from "@/components/FunctionalButton";
import { View, Text, Button, TouchableOpacity } from "react-native";
import {
  useAudioPlayer,
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
// THIS PAGE NEEDS AUDIO. await supbabase, pass in as prop
// check page

// ----- GET Lesson interface -----

interface Lesson {
  level_id: string;
  id: string;
  category: string;
  hangul: string;
  order_index: number;
  level: string;
  title: string;
  yale_romanization: string;
}

export default function vowelPage() {
  // ----- Path Logic -----
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const level = parts[1];
  const category = parts[2];
  const character = parts[3];
  // ----- SUPABASE FETCH LESSON ------
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (!level || !category || !character) return;

    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("level", Number(level))
        .eq("category", category)
        .eq("yale_romanization", character);
      if (error) console.log("error:", error);
      else setLessons(data ?? []);
    };

    fetchLessons();
  }, [level, category, character]);
  // ----- SUPABASE FETCH correct audio  -----

  useEffect(() => {
    if (!character) return;

    const loadAudio = async () => {
      const path = `${character}.mp3`;

      const { data, error } = await supabase.storage
        .from("lessonAudio")
        .download(path);

      if (error) {
        console.error("Audio not found:", error.message);
        setAudioUrl(null);
        return;
      }

      // File exists → now get public URL
      const { data: publicData } = supabase.storage
        .from("lessonAudio")
        .getPublicUrl(path);

      setAudioUrl(publicData.publicUrl);
    };

    loadAudio();
  }, [character]);

  // ----- For playing correct Audio -----
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const playerEu = useAudioPlayer();

  useEffect(() => {
    if (!audioUrl) return;
    playerEu.replace(audioUrl);
  }, [audioUrl]);

  const recordedPlayer = useAudioPlayer();
  // ----- Recording Audio -----
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  // ----- Recording Controls -----
  const record = async () => {
    await setAudioModeAsync({
      playsInSilentMode: true,
      allowsRecording: true,
    });
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
    });
  }, []);

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
    if (audioRecorder.uri) {
      recordedPlayer.replace(audioRecorder.uri);
    }
    await setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
    });
  };
  // ----- IOS permissions setup -----

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        alert("Permission to access microphone was denied");
        return;
      }
    })();
  }, []);

  return (
    <HalfSplashTemplate
      topContent={
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>
            Listen and Compare
          </Text>
        </View>
      }
      bottomContent={
        <View>
          {lessons.map((lesson) => (
            <MyButton
              key={lesson.id}
              title={lesson.hangul}
              onPress={() => {
                if (!playerEu.isLoaded) return;
                playerEu.seekTo(0);
                playerEu.play();
              }}
            />
          ))}

          <MyButton
            title={
              recorderState.isRecording ? (
                <Icon name="square" size={40} color="red" /> // universal stop icon
              ) : (
                <Icon name="mic" size={40} color="red" /> // universal stop icon
              )
            }
            onPress={recorderState.isRecording ? stopRecording : record}
          />
          <MyButton
            title={<Icon name="volume-high" size={40} color="black" />}
            onPress={() => recordedPlayer.play()}
            disabled={!audioRecorder.uri}
          />
        </View>
      }
    />
  );
}
