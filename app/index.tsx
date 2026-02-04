// app/index.tsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../supabaseConfig"; // your supabase client
import { useThemeColors } from "../theme/useThemeColors";
import SplashTemplate from "../components/TemplateScreen"; // adjust path to your template
import { getLevelImage } from "@/lib/levelAssets";
interface Level {
  created_at: string;
  id: string; // UUID
  level_number: number;
  title: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    const fetchLevels = async () => {
      const { data, error } = await supabase.from("levels").select("*");
      if (error) console.log(error);
      else {
        setLevels(data || []);
      }
    };

    fetchLevels();
  }, []);
  return (
    <SplashTemplate
      // Top 1/3 content: put text, logo, etc.
      topContent={
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>
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
            <TouchableOpacity
              key={level.id}
              style={[styles.button]}
              onPress={() => router.push(`/level/${level.level_number}`)}
            >
              <Image
                source={getLevelImage(level.level_number)}
                style={styles.buttonImage}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>{level.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    width: "48%",
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
});
