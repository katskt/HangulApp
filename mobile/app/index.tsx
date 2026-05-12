// app/index.tsx
import MyButton from "@/components/FunctionalButton";
import SplashTemplate from "@/components/TemplateScreen"; // adjust path to your template
import { getLevelImage } from "@/lib/levelAssets";
import { supabase } from "@/supabaseConfig";
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { wp } = useResponsive();
  const router = useRouter();
  const colors = useThemeColors();
  const [name, setName] = useState("");

  const levels = [
    { level_number: 1, title: "HANGEUL 1" },
    { level_number: 2, title: "HANGEUL 2" },
    { level_number: 3, title: "HANGEUL 3" },
    { level_number: 4, title: "HANGEUL 4" },
  ];

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData?.user) return;

      const { data } = await supabase
        .from("profiles")
        .select("first_name")
        .eq("id", userData.user.id)
        .single();

      if (data) {
        setName(data.first_name);
      }
    };

    loadProfile();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
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
      fontFamily: Typography.english,
    },
  });

  return (
    <SplashTemplate
      // Top 1/3 content: put text, logo, etc.
      topContent={
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: FontSizes.header,
              fontWeight: FontWeights.bold,
              fontFamily: Typography.default,
              color: colors.text,
            }}
          >
            안녕하세요 {name}!
          </Text>
        </View>
      }
      // Bottom 2/3 content: buttons, forms, other components
      bottomContent={
        <View style={{ height: "95%" }}>
          <MyButton onPress={() => router.push("/activity")}>
            <Text style={styles.buttonText}>ACTIVITY</Text>
          </MyButton>

          <View
            style={[styles.container, { backgroundColor: colors.background }]}
          >
            {levels.map((level) => (
              <MyButton
                key={level.level_number}
                style={{
                  width: wp(35),
                  height: wp(35),
                  justifyContent: "flex-start",
                  alignItems: "center",
                  borderRadius: 20,
                }}
                onPress={() => router.push(`/level/${level.level_number}`)}
              >
                <Image
                  source={getLevelImage(level.level_number)}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.buttonText}>{level.title}</Text>
              </MyButton>
            ))}
          </View>
          <View style={{ flexDirection: "row" }}>
            <MyButton
              style={{ flex: 1 }}
              onPress={() => router.push("/finalQuizA")}
            >
              <Text style={styles.buttonText}>Final Quiz A</Text>
            </MyButton>
            <MyButton
              style={{ flex: 1 }}
              onPress={() => router.push("/finalQuizB")}
            >
              <Text style={styles.buttonText}>Final Quiz B</Text>
            </MyButton>
          </View>
        </View>
      }
    />
  );
}
