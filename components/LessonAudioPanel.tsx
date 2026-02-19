import { View, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import HalfSplashTemplate from "@/components/LessonBackgroundScreen";
import MyButton from "@/components/FunctionalButton";
import { useLessonAudio } from "@/hooks/useLessonAudio";
import useImage from "@/hooks/useImage";

export default function LessonAudioPanel({
  character,
  hangeul,
  image,
}: {
  character: string;
  hangeul: string;
  image?: boolean;
}) {
  const {
    playReference,
    startRecording,
    stopRecording,
    playRecording,
    isRecording,
    hasRecording,
  } = useLessonAudio(character);

  const { imageUrl } = useImage(character);
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
          <View style={styles.container}>
            {image && (
              <Image
                style={styles.image}
                source={
                  image
                    ? { uri: imageUrl }
                    : require("../assets/images/android-icon-foreground.png")
                }
              />
            )}
          </View>
          <MyButton title={hangeul} onPress={playReference} />

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

const styles = StyleSheet.create({
  image: {
    width: 180,
    height: 180,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});
