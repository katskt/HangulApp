import MyButton from "@/components/FunctionalButton";
import Hint from "@/components/Hint";
import { useLessonAudio } from "@/hooks/useLessonAudio";
import { practiceImages } from "@/lib/practiceImages";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import BlueScreen from "./BlueScreen";
export default function LessonAudioPanel({
  character,
  canvas,
  image,
  onAudioPlayed,
}: {
  character: string;
  canvas: React.ReactNode;
  image?: boolean;
  onAudioPlayed?: () => void;
}) {
  const {
    playCurrentAudio,
    startRecording,
    stopRecording,
    playRecording,
    hasRecording,
  } = useLessonAudio(character);
  const { wp, hp } = useResponsive();
  const colors = useThemeColors();
  const [showRecordHint, setShowRecordHint] = useState(false);
  const [showListenHint, setShowListenHint] = useState(true);
  const [pressListenHint, setPressListenHint] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [hasPlayedRecording, setHasPlayedRecording] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const recordingStart = useRef<number>(0);

  const handlePressIn = async () => {
    setIsPressed(true);
    recordingStart.current = Date.now();
    await startRecording();
  };

  const handlePressOut = async () => {
    setIsPressed(false);

    const duration = Date.now() - recordingStart.current;
    await stopRecording();
    if (duration < 500) {
      // less than 0.5 seconds
      setShowRecordHint(true);
      setTimeout(() => setShowRecordHint(false), 1800);
    } else {
      setHasRecorded(true);
    }
    setShowListenHint(false);
  };

  useEffect(() => {
    if (hasListened && hasRecorded && hasPlayedRecording) {
      onAudioPlayed?.();
    }
  }, [hasListened, hasRecorded, hasPlayedRecording]);

  return (
    <BlueScreen
      content={
        <View style={{ height: hp(70) }}>
          <View style={[styles.containerSideBySide, { marginBottom: "auto" }]}>
            {image && (
              <View style={styles.container}>
                {
                  <Image
                    style={{
                      width: wp(20),
                      height: wp(20),
                      margin: wp(2),
                      borderRadius: wp(1),
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
                borderColor:
                  hasListened === true ? colors.select : colors.unselect,
                borderRadius: 50,
              }}
              onPress={() => {
                playCurrentAudio();
                setHasListened(true);
              }}
            >
              {<Icon name="volume-high" size={40} />}
            </MyButton>
          </View>
          <View>
            <Text style={{ alignSelf: "center" }}> {canvas}</Text>
          </View>
          <View style={[styles.containerSideBySide, { marginTop: "auto" }]}>
            <View style={styles.itemSideBySide}>
              <MyButton
                style={{
                  height: hp(15),
                  borderColor:
                    hasRecorded === true ? colors.select : colors.unselect,
                }}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                {isPressed ? (
                  <Icon name="square" size={100} color="red" />
                ) : (
                  <Icon name="mic" size={100} color="red" />
                )}
              </MyButton>
            </View>
            <View style={styles.itemSideBySide}>
              <MyButton
                style={{
                  height: hp(15),
                  borderColor:
                    hasPlayedRecording === true
                      ? colors.select
                      : colors.unselect,
                }}
                onPressIn={() => {
                  playRecording();
                  setPressListenHint(true);
                  if (hasRecorded) {
                    setHasPlayedRecording(true);
                  }
                }}
                onPressOut={() => setPressListenHint(false)}
                disabled={!hasRecording}
              >
                {<Icon name="happy" size={100} />}
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
