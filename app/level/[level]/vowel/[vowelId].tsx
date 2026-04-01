import LessonAudioPanel from "@/components/LessonAudioPanel";
import ProgressBar from "@/components/ProgressBar";
import CanvasPage from "@/components/TraceCanvas";
import { supabase } from "@/supabaseConfig";
import { sharedStyles } from "@/theme/sharedStyles";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import Loading from "@components/Loading";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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

  const { wp, hp } = useResponsive();
  const level = parts[1];
  const category = parts[2];
  const character = parts[3]; // group romanization from URL

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const colors = useThemeColors();

  /* DOTS FOR SCROLLING BEHAVIOR */
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = lessons.length * 2; // 2 pages per lesson
  /* END */

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

  if (!lessons.length) return <Loading />;
  return (
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
      <ScrollView
        // Add onScroll to ScrollView:
        onScroll={(e) => {
          const page = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          setCurrentPage(page);
        }}
        scrollEventThrottle={16}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        style={{ width: wp(100), flex: 1, backgroundColor: colors.background }}
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

      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: colors.background,
        }}
      >
        <ProgressBar
          currentQuestionNumber={currentPage + 1}
          totalQuizNumber={totalPages}
        ></ProgressBar>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    width: screenWidth,
    flex: 1,
  },
});
