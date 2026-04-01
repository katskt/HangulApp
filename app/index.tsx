// app/index.tsx
import MyButton from "@/components/FunctionalButton";
import SplashTemplate from "@/components/TemplateScreen"; // adjust path to your template
import { getLevelImage } from "@/lib/levelAssets";
import { supabase } from "@/supabaseConfig"; // your supabase client
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface Level {
  created_at: string;
  id: string; // UUID
  level_number: number;
  title: string;
}

export default function HomeScreen() {
  const { wp, hp } = useResponsive();
  const router = useRouter();
  const colors = useThemeColors();
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    const fetchLevels = async () => {
      const { data, error } = await supabase
        .from("levels")
        .select("*")
        .order("level_number", {
          ascending: true,
        });
      if (error) console.log(error);
      else {
        setLevels(data || []);
      }
    };

    fetchLevels();
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
            }}
          >
            안녕하세요 Katie!
          </Text>
        </View>
      }
      // Bottom 2/3 content: buttons, forms, other components
      bottomContent={
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          {levels.map((level) => (
            <MyButton
              key={level.id}
              style={{
                width: wp(38),
                height: wp(38),
                justifyContent: "flex-start",
                alignItems: "center",
                borderRadius: 20,
              }}
              onPress={() => router.push(`/level/${level.level_number}`)}
            >
              <Image
                source={getLevelImage(level.level_number)}
                style={styles.buttonImage}
                resizeMode="cover"
              />
              <Text style={styles.buttonText}>{level.title}</Text>
            </MyButton>
          ))}
        </View>
      }
    />
  );
}
