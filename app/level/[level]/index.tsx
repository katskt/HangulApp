// app/index.tsx
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "@/supabaseConfig"; // your supabase client
import { useThemeColors } from "@/theme/useThemeColors";
import { FontSizes, FontWeights } from "@/theme/typography";
import Button from "@/components/button";
import BlueScreen from "@/components/BlueScreen";
import { getLevelImage } from "@/lib/levelAssets";

export default function LevelPage() {
  // Type your params for TypeScript

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
          <Text
            style={{
              fontSize: FontSizes.header,
              fontWeight: FontWeights.bold,
            }}
          >
            HANGEUL {levelNumber}
          </Text>
          <Image
            source={getLevelImage(levelNumber)}
            resizeMode="cover"
            style={styles.icon}
          />
        </View>
      }
      content={
        <ScrollView style={{ height: "80%" }}>
          <Text
            style={{ fontSize: FontSizes.h3, fontWeight: FontWeights.bold }}
          >
            LESSON{" "}
          </Text>
          <Button
            target={`/level/${levelNumber}/vowel`}
            title={"Vowel"}
            background={"아 어 오 우 으 이"}
            fill={"#FFF"}
          />
          <Button
            target={`/level/${levelNumber}/consonant`}
            title={"Consonant"}
            background={"ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ"}
            fill={"#FFF"}
          />
          <Button
            target={`/level/${levelNumber}/practice`}
            title={"Practice"}
            background={""}
            fill={"#FFF"}
          />
          <Text
            style={{ fontSize: FontSizes.h3, fontWeight: FontWeights.bold }}
          >
            QUIZ A
          </Text>
          {quizLevels.map((quiz_level) => (
            <View key={quiz_level}>
              <Button
                target={`/level/${levelNumber}/quiz/${quiz_level}/A`}
                title={"Quiz " + quiz_level + "A"}
                background={""}
                fill={"#FFF"}
              />
            </View>
          ))}
          <Text
            style={{ fontSize: FontSizes.h3, fontWeight: FontWeights.bold }}
          >
            QUIZ B
          </Text>
          {quizLevels.map((quiz_level) => (
            <View key={quiz_level}>
              <Button
                target={`/level/${levelNumber}/quiz/${quiz_level}/B`}
                title={"Quiz " + quiz_level + "B"}
                background={""}
                fill={"#FFF"}
              />
            </View>
          ))}
        </ScrollView>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
  },
  button: {
    width: "50%",
    height: 160,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  buttonImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.9,
  },
  buttonText: {
    padding: 20,
    fontSize: 18,
    opacity: 0.5,
  },
  icon: {
    borderRadius: 40,
    width: 75,
    height: 75,
    borderWidth: 2,
  },
});
