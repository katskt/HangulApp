import { useState, useRef } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { lessonStroke } from "@/lib/lessonStroke";
import { practiceImages } from "@/lib/practiceImages";
import Icon from "react-native-vector-icons/Ionicons";
import HalfSplashTemplate from "@/components/LessonBackgroundScreen";
import Loading from "@/components/Loading";
import MyButton from "@/components/FunctionalButton";
import { useLessonAudio } from "@/hooks/useLessonAudio";
import useImage from "@/hooks/useImage";
import { useThemeColors } from "@/theme/useThemeColors";
import { FontSizes } from "@/theme/typography";
import Hint from "@/components/hint";
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
  const colors = useThemeColors();
  const [showHint, setShowHint] = useState(false);
  const recordingStart = useRef<number>(0);

  const handlePressIn = async () => {
    recordingStart.current = Date.now();
    await startRecording();
  };

  const handlePressOut = async () => {
    const duration = Date.now() - recordingStart.current;
    await stopRecording();
    if (duration < 500) {
      // less than 0.5 seconds
      setShowHint(true);
      setTimeout(() => setShowHint(false), 1800);
    }
  };
  // const { imageUrl } = useImage(character);
  /*   if (loading) {
    return <Loading></Loading>;
  } */
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
            {/*             {image &&
              (imageUrl ? (
                <Image style={styles.image} source={{ uri: imageUrl }} />
              ) : (
                <Loading />
              ))} */}
            {image && (
              <Image style={styles.image} source={practiceImages[character]} />
            )}
          </View>
          <MyButton onPress={playReference}>
            {<Text style={{ fontSize: FontSizes.hugeXL }}>{hangeul}</Text>}
          </MyButton>

          <MyButton onPressIn={handlePressIn} onPressOut={handlePressOut}>
            {isRecording ? (
              <Icon name="square" size={40} color="red" />
            ) : (
              <Icon name="mic" size={40} color="red" />
            )}
          </MyButton>
          {showHint && <Hint>Press and Hold to Record</Hint>}
          <MyButton onPress={playRecording} disabled={!hasRecording}>
            {<Icon name="volume-high" size={40} />}
          </MyButton>
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
