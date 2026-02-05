import React, { useEffect, useState } from "react";
import { View, ScrollView, Dimensions, StyleSheet, Text } from "react-native";
import { usePathname } from "expo-router";
import { supabase } from "../../../../supabaseConfig";
import LessonAudioPanel from "@/components/LessonAudioPanel";
import CanvasPage from "../../../../components/TraceCanvas";
import { useThemeColors } from "../../../../theme/useThemeColors";

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

const { width: screenWidth } = Dimensions.get("window");

export default function LessonPage() {
  const parts = usePathname().split("/").filter(Boolean);
  const level = parts[1];
  const category = parts[2];
  const character = parts[3]; // group romanization from URL

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const colors = useThemeColors();

  // Fetch lessons
  useEffect(() => {
    if (!level || !category || !character) return;

    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("level", Number(level))
        .eq("category", category)
        .eq("group_romanization", character)
        .order("order_index", { ascending: true });

      if (error) {
        console.error("Error fetching lessons:", error.message);
        return;
      }

      if (data) setLessons(data as Lesson[]);
    };

    fetchLessons();
  }, [level, category, character]);

  if (!lessons.length) return <Text>Loading...</Text>;

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={true}
      scrollEnabled={scrollEnabled}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      {lessons.map((lesson) => (
        <React.Fragment key={lesson.id}>
          {/* Page 1: Audio Panel */}
          <View style={[styles.page, { width: screenWidth }]}>
            <LessonAudioPanel
              character={lesson.hangeul_romanization}
              hangeul={lesson.hangeul}
            />
          </View>

          {/* Page 2: Trace Canvas */}
          <View style={[styles.page, { width: screenWidth }]}>
            <CanvasPage
              character={lesson.hangeul_romanization}
              onTouchStart={() => setScrollEnabled(false)}
              onTouchEnd={() => setScrollEnabled(true)}
            />
          </View>
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    width: screenWidth,
    flex: 1,
  },
});
