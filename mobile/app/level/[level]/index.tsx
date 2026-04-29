// app/index.tsx
import lessonData from "@/app/data/lessons_rows.json";
import quizData from "@/app/data/quizzes_rows.json";
import BlueScreen from "@/components/BlueScreen";
import MyButton from "@/components/FunctionalButton";
import { getLevelImage } from "@/lib/levelAssets";
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { useRouteParams } from "@/hooks/useRouteParams";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function LevelPage() {
  const colors = useThemeColors();
  const router = useRouter();

  // Type your params for TypeScript
  const { wp, hp } = useResponsive();
  const [quizLevels, setQuizLevels] = useState<number[]>([]);
  const [practiceLevels, setPracticeLevels] = useState<(string | number)[]>([]);
  const { level } = useRouteParams();

  useEffect(() => {
    const quizzes = quizData
      .filter((q) => q.level === Number(level))
      .map((q) => q.quiz)
      .filter((v, i, a) => a.indexOf(v) === i) // unique values
      .sort();
    setQuizLevels(quizzes);
  }, [Number(level)]);

  useEffect(() => {
    const practices = lessonData
      .filter((q) => q.level === Number(level) && q.category === "practice")
      .map((q) => q.group_order)
      .filter((v, i, a) => a.indexOf(v) === i) // unique values
      .sort();
    setPracticeLevels(practices);
  }, [Number(level)]);

  const styles = StyleSheet.create({
    buttonText: {
      fontSize: FontSizes.header,
      fontWeight: FontWeights.semibold,
      padding: hp(2),
      fontFamily: Typography.english,
    },
    button: {
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
    title: {
      fontSize: FontSizes.huge,
      fontWeight: FontWeights.bold,
      color: colors.text,
      fontFamily: Typography.english,
    },
    header: {
      marginVertical: hp(2),
      fontSize: FontSizes.header,
      fontWeight: FontWeights.bold,
      color: colors.text,
      fontFamily: Typography.english,
    },
  });

  return (
    <BlueScreen
      header={
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>HANGEUL {Number(level)}</Text>
        </View>
      }
      content={
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ height: "80%" }}
        >
          <Text style={styles.header}>LESSON</Text>
          <MyButton
            style={styles.button}
            onPress={() => router.push(`/level/${Number(level)}/vowel`)}
          >
            <Text style={styles.buttonText}>VOWEL</Text>
          </MyButton>

          <MyButton
            style={styles.button}
            onPress={() => router.push(`/level/${Number(level)}/consonant`)}
          >
            <Text style={styles.buttonText}>CONSONANT</Text>
          </MyButton>

          <Text style={styles.header}>PRACTICE</Text>

          {practiceLevels.map((practice_level) => (
            <MyButton
              key={practice_level}
              style={styles.button}
              onPress={() =>
                router.push(
                  `/level/${Number(level)}/practice/${practice_level}`,
                )
              }
            >
              <Text style={styles.buttonText}>
                {"Practice " + practice_level}
              </Text>
            </MyButton>
          ))}

          <Text style={styles.header}>QUIZ A</Text>

          {quizLevels.map((quiz_level) => (
            <MyButton
              key={quiz_level}
              style={styles.button}
              onPress={() =>
                router.push(`/level/${Number(level)}/quiz/${quiz_level}/A`)
              }
            >
              <Text style={styles.buttonText}>
                {"QUIZ " + quiz_level + "A"}
              </Text>
            </MyButton>
          ))}
          <Text style={styles.header}>QUIZ B</Text>
          {quizLevels.map((quiz_level) => (
            <MyButton
              key={quiz_level}
              style={styles.button}
              onPress={() =>
                router.push(`/level/${Number(level)}/quiz/${quiz_level}/B`)
              }
            >
              <Text style={styles.buttonText}>
                {"QUIZ " + quiz_level + "B"}
              </Text>
            </MyButton>
          ))}
        </ScrollView>
      }
    />
  );
}
