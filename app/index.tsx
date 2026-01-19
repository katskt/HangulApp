// app/index.tsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../supabaseConfig"; // your supabase client
import { useThemeColors } from "../theme/useThemeColors";

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
        console.log("data fetched:", data);
        setLevels(data || []);
      }
    };

    fetchLevels();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {levels.map((level) => (
        <TouchableOpacity
          key={level.id}
          style={[
            styles.button,
            { backgroundColor: colors.button || colors.tint },
          ]}
          onPress={() => router.push(`/level/${level.id}`)}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            {level.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
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
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 12,
  },
  buttonText: { fontSize: 18, fontWeight: "bold" },
});
