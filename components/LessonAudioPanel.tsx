import MyButton from "@/components/FunctionalButton";
import Hint from "@/components/hint";
import HalfSplashTemplate from "@/components/LessonBackgroundScreen";
import { useLessonAudio } from "@/hooks/useLessonAudio";
import { practiceImages } from "@/lib/practiceImages";
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import { useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
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
  const { wp, hp } = useResponsive();
  const [showRecordHint, setShowRecordHint] = useState(false);
  const [showListenHint, setShowListenHint] = useState(true);
  const [pressListenHint, setPressListenHint] = useState(false);
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
      setShowRecordHint(true);
      setTimeout(() => setShowRecordHint(false), 1800);
    }
    setShowListenHint(false);
  };

  return (
    <HalfSplashTemplate
      topContent={
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: FontSizes.header,
              fontWeight: FontWeights.bold,
              fontFamily: Typography.english,
            }}
          >
            LISTEN & COMPARE
          </Text>
        </View>
      }
      bottomContent={
        <View style={{ width: wp(90), height: hp(70) }}>
          <View style={[styles.containerSideBySide, { marginBottom: "auto" }]}>
            {image && (
              <View style={styles.container}>
                {
                  <Image
                    style={{
                      width: wp(30),
                      height: wp(30),
                    }}
                    source={practiceImages[character]}
                  />
                }
              </View>
            )}
            <MyButton
              style={{
                backgroundColor: "#FFF9E7",
                width: wp(40),
                height: hp(10),
                alignSelf: "center",
                borderWidth: 10,
                borderColor: "#ded2ad63",
                borderRadius: 50,
              }}
              onPress={() => playReference()}
            >
              {<Icon name="volume-high" size={40} />}
            </MyButton>
          </View>
          <View>
            <Text
              style={[
                {
                  color: colors.text,
                  fontSize: FontSizes.character,
                  margin: "auto",
                  fontFamily: Typography.default,
                },
              ]}
            >
              {hangeul}
            </Text>
          </View>
          <View style={[styles.containerSideBySide, { marginTop: "auto" }]}>
            <View style={styles.itemSideBySide}>
              <MyButton
                style={{ height: hp(15) }}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                {isRecording ? (
                  <Icon name="square" size={40} color="red" />
                ) : (
                  <Icon name="mic" size={40} color="red" />
                )}
              </MyButton>
            </View>
            <View style={styles.itemSideBySide}>
              <MyButton
                style={{ height: hp(15) }}
                onPressIn={() => {
                  playRecording();
                  setPressListenHint(true);
                }}
                onPressOut={() => setPressListenHint(false)}
                disabled={!hasRecording}
              >
                {<Icon name="happy" size={40} />}
              </MyButton>
            </View>
          </View>
          {showRecordHint && <Hint>Press and Hold to Record</Hint>}
          {showListenHint && pressListenHint && <Hint>No Audio</Hint>}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
  containerSideBySide: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  itemSideBySide: {
    flex: 1,
  },
});
