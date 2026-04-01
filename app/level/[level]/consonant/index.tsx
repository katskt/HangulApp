import BlueScreen from "@/components/BlueScreen";
import SmallButton from "@/components/SmallButton";
import { supabase } from "@/supabaseConfig"; // your supabase client
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

// Go back button
import { sharedStyles } from "@/theme/sharedStyles";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";

interface Lesson {
  category: string;
  id: string;
  hangul: string;
  group: string;
  group_romanization: string;
  order_index: number;
  level: number;
  hangeul: string;
  hangeul_romanization: string;
}

import { useThemeColors } from "@/theme/useThemeColors";
import { Text, View } from "react-native";
export default function vowelPage() {
  // check page
  const router = useRouter();
  const colors = useThemeColors();
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const level = parts[1];
  const category = parts[2];
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    if (!level || !category) return;
    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from("lessons_unique_groups")
        .select("*")
        .eq("level", level)
        .eq("category", category)
        .order("order_index", { ascending: true });

      if (error) console.log("error:", error);
      else {
        setLessons(data || []);
      }
    };
    fetchLessons();
  }, [level, category]);

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
              fontSize: FontSizes.huge,
              fontWeight: FontWeights.bold,
              fontFamily: Typography.english,
              color: colors.text,
            }}
          >
            CONSONANT
          </Text>
        </View>
      }
      content={
        <>
          <Stack.Screen
            options={{
              headerShown: true,
              headerTransparent: true,
              headerTitle: "",
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    router.back();
                  }}
                  style={sharedStyles.iconButton}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              ),
            }}
          />
          <ScrollView>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {lessons.map((lesson) => (
                <View key={lesson.id} style={{ width: "50%", padding: 8 }}>
                  <SmallButton
                    fill="#FFF"
                    target={`/level/${level}/${category}/${lesson.group_romanization}`}
                  >
                    <Text
                      style={{
                        fontSize: FontSizes.huge,
                        fontWeight: FontWeights.semibold,
                        fontFamily: Typography.default,
                      }}
                    >
                      {lesson.group}
                    </Text>
                  </SmallButton>
                </View>
              ))}
            </View>
          </ScrollView>
        </>
      }
    />
  );
}
