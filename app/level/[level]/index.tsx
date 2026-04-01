// app/index.tsx
import BlueScreen from "@/components/BlueScreen";
import MyButton from "@/components/FunctionalButton";
import { getLevelImage } from "@/lib/levelAssets";
import { supabase } from "@/supabaseConfig"; // your supabase client
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
export default function LevelPage() {
  const colors = useThemeColors();
  const router = useRouter();

  // Type your params for TypeScript
  const { wp, hp } = useResponsive();
  const [quizLevels, setQuizLevels] = useState<number[]>([]);
  const params = useLocalSearchParams<{ level: string }>();
  const levelNumber = Number(params.level);
  useEffect(() => {
    const fetchLevels = async () => {
      const { data, error } = await supabase
        .from("quiz_unique_quiz")
        .select("quiz")
        .eq("level", levelNumber)
        .order("quiz", {
          ascending: true,
        });

      if (error) {
        console.log(error);
      } else {
        setQuizLevels((data ?? []).map((row) => row.quiz));
      }
    };

    fetchLevels();
  }, [levelNumber]);

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
      borderBottomWidth: wp(2),
      borderBottomColor: "#8e8e8e",
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
          <Text style={styles.title}>HANGEUL {levelNumber}</Text>
          <Image
            source={getLevelImage(levelNumber)}
            resizeMode="cover"
            style={{
              borderRadius: wp(10),
              width: wp(20),
              height: wp(20),
              borderWidth: 2,
            }}
          />
        </View>
      }
      content={
        <ScrollView style={{ height: "80%" }}>
          <Text style={styles.header}>LESSON</Text>
          <MyButton
            style={styles.button}
            onPress={() => router.push(`/level/${levelNumber}/vowel`)}
          >
            <Text style={styles.buttonText}>VOWEL</Text>
          </MyButton>

          <MyButton
            style={styles.button}
            onPress={() => router.push(`/level/${levelNumber}/consonant`)}
          >
            <Text style={styles.buttonText}>CONSONANT</Text>
          </MyButton>

          <Text style={styles.header}>PRACTICE</Text>
          <MyButton
            style={styles.button}
            onPress={() => router.push(`/level/${levelNumber}/practice`)}
          >
            <Text style={styles.buttonText}>PRACTICE</Text>
          </MyButton>

          <Text style={styles.header}>QUIZ A</Text>

          {quizLevels.map((quiz_level) => (
            <MyButton
              key={quiz_level}
              style={styles.button}
              onPress={() =>
                router.push(`/level/${levelNumber}/quiz/${quiz_level}/A`)
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
                router.push(`/level/${levelNumber}/quiz/${quiz_level}/B`)
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
