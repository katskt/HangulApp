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
import { supabase } from "../../../supabaseConfig"; // your supabase client
import { useThemeColors } from "../../../theme/useThemeColors";
import { FontSizes, FontWeights } from "../../../theme/typography";
import Button from "../../../components/button";

import BlueScreen from "@/components/BlueScreen";
import { getLevelImage } from "@/lib/levelAssets";

export default function LevelPage() {
  // Type your params for TypeScript
  const params = useLocalSearchParams<{ level: string }>();
  const levelNumber = Number(params.level);
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
            style={{ fontSize: FontSizes.header, fontWeight: FontWeights.bold }}
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
            title={"Vowels"}
            background={"아 어 오 우 으 이"}
            fill={"#FFF"}
          />
          <Button
            target={`/level/${levelNumber}/consonant`}
            title={"Consonants"}
            background={"ㄱㄴㄷㄹㅁㅂㅅ"}
            fill={"#FFF"}
          />
          <Text
            style={{ fontSize: FontSizes.h3, fontWeight: FontWeights.bold }}
          >
            QUIZ A
          </Text>
          <Button title={"Quiz 1A"} background={""} fill={"#FFF"} />
          <Button title={"Quiz 2A"} background={""} fill={"#FFF"} />
          <Text
            style={{ fontSize: FontSizes.h3, fontWeight: FontWeights.bold }}
          >
            QUIZ B
          </Text>
          <Button title={"Quiz 1B"} background={""} fill={"#FFF"} />
          <Button title={"Quiz 2B"} background={""} fill={"#FFF"} />
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
