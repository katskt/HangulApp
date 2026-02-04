import BlueScreen from "@/components/BlueScreen";
import { FontSizes, FontWeights } from "../../../../theme/typography";
import { usePathname, useRouter } from "expo-router";
import { supabase } from "../../../../supabaseConfig"; // your supabase client
import SmallButton from "../../../../components/SmallButton";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
// import { useThemeColors } from "../theme/useThemeColors";

interface Lesson {
  level_id: string;
  id: string;
  category: string;
  hangul: string;
  order_index: number;
  level: number;
  title: string;
  yale_romanization: string;
}

import { Text, View } from "react-native";
export default function vowelPage() {
  // check page
  const router = useRouter();
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const level = parts[1];
  const category = parts[2];
  const [lessons, setLessons] = useState<Lesson[]>([]);
  console.log(pathname);

  useEffect(() => {
    if (!level || !category) return;
    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("level", level)
        .eq("category", category)
        .order("order_index", { ascending: true });

      if (error) console.log("error:", error);
      else {
        setLessons(data || []);
      }
      console.log("vowel page:", data);
    };
    fetchLessons();
  }, [level, category]);

  console.log(pathname); /* Do this for path!!! */
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
            Vowel
          </Text>
        </View>
      }
      content={
        <ScrollView>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {lessons.map((lesson) => (
              <View key={lesson.id} style={{ width: "50%", padding: 8 }}>
                <TouchableOpacity key={lesson.id}>
                  <SmallButton
                    fill="#FFF"
                    title={lesson.hangul}
                    target={`/level/${level}/${category}/${lesson.yale_romanization}`}
                  ></SmallButton>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      }
    />
  );
}
