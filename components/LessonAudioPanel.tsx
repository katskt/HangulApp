import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import HalfSplashTemplate from "@/components/LessonBackgroundScreen";
import MyButton from "@/components/FunctionalButton";
import { useLessonAudio } from "@/hooks/useLessonAudio";

export default function LessonAudioPanel({
  character,
  hangul,
}: {
  character: string;
  hangul: string;
}) {
  const {
    playReference,
    startRecording,
    stopRecording,
    playRecording,
    isRecording,
    hasRecording,
  } = useLessonAudio(character);

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
          <MyButton title={hangul} onPress={playReference} />

          <MyButton
            title={
              isRecording ? (
                <Icon name="square" size={40} color="red" />
              ) : (
                <Icon name="mic" size={40} color="red" />
              )
            }
            onPress={isRecording ? stopRecording : startRecording}
          />

          <MyButton
            title={<Icon name="volume-high" size={40} />}
            onPress={playRecording}
            disabled={!hasRecording}
          />
        </View>
      }
    />
  );
}
