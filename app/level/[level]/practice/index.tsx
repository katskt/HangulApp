import LessonAudioPanel from "@/components/LessonAudioPanel";
import Loading from "@/components/Loading";
import ProgressBar from "@/components/ProgressBar";
import CanvasPage from "@/components/TraceCanvas";
import { supabase } from "@/supabaseConfig";
import { sharedStyles } from "@/theme/sharedStyles";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Stack, usePathname, useRouter } from "expo-router";
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
  const { wp, hp } = useResponsive();
  const router = useRouter();
  const parts = usePathname().split("/").filter(Boolean);
  const level = parts[1];
  const category = parts[2];

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const colors = useThemeColors();
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = lessons.length * 2; // 2 pages per lesson

  // Fetch lessons
  useEffect(() => {
    if (!level || !category) return;

    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("level", Number(level))
        .eq("category", category)
        .order("order_index", { ascending: true });

      if (error) {
        console.error("Error fetching lessons:", error.message);
        return;
      }

      if (data) setLessons(data as Lesson[]);
    };

    fetchLessons();
  }, [level, category]);

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
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        {lessons.map((lesson) => (
          <React.Fragment key={lesson.id}>
            {/* Page 1: Audio Panel */}
            <View style={[styles.page, { width: wp(100) }]}>
              <LessonAudioPanel
                character={lesson.hangeul_romanization}
                hangeul={lesson.hangeul}
                image={true}
              />
            </View>

            {/* Page 2: Trace Canvas */}
            <View style={[styles.page, { width: wp(100) }]}>
              <CanvasPage
                character={lesson.hangeul_romanization}
                onTouchStart={() => setScrollEnabled(false)}
                onTouchEnd={() => setScrollEnabled(true)}
                image={true}
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
