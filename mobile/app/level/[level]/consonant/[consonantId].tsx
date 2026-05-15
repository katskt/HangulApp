import lessonsData from "@/app/data/lessons_rows.json";
import ProgressBar from "@/components/ProgressBar";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { sharedStyles } from "@/theme/sharedStyles";
import Loading from "@components/Loading";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
import { useRouteParams } from "@/hooks/useRouteParams";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import LessonAudioPanel from "@/components/LessonAudioPanel";
import CanvasPage from "@/components/TraceCanvas";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
interface Lesson {
  category: string;
  hangeul: string;
  order_index: number;
  level: number;
  hangeul_romanization: string;
  group: string;
  group_romanization: string;
  group_order: number;
}

export default function LessonPage() {
  const { wp } = useResponsive();
  const { level, category, id } = useRouteParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const colors = useThemeColors();
  const totalPages = lessons.length; // 1 page per lesson

  // in consonant, vowel, practice pages - all the same:
  const { markComplete, completedCount } = useLessonProgress(
    lessons,
    level,
    category, // "consonant", "vowel", or "practice"
  );

  // Scrolling
  const scrollViewRef = useRef<ScrollView>(null);

  const [currentPage, setCurrentPage] = useState(0);

  const goToNextPage = () => {
    const nextPage = currentPage + 1;

    if (nextPage < totalPages) {
      scrollViewRef.current?.scrollTo({
        x: nextPage * wp(100),
        animated: false,
      });

      setCurrentPage(nextPage);
    }
  };

  const goToPrevPage = () => {
    const prevPage = currentPage - 1;

    if (prevPage >= 0) {
      scrollViewRef.current?.scrollTo({
        x: prevPage * wp(100),
        animated: false,
      });

      setCurrentPage(prevPage);
    }
  };
  // Fetch lessons
  useEffect(() => {
    if (!level || !category || !id) return;
    const data = lessonsData
      .filter(
        (l) =>
          Number(l.level) === Number(level) &&
          l.category === category &&
          l.group_romanization === id,
      )
      .sort((a, b) => a.order_index - b.order_index);
    setLessons(data);
  }, [level, category, id]);

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
        scrollEventThrottle={16}
        horizontal
        ref={scrollViewRef}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ width: wp(100), flex: 1, backgroundColor: colors.background }}
      >
        {lessons.map((lesson) => (
          <React.Fragment key={lesson.order_index}>
            {/* Page 1: Audio Panel */}
            <View style={[styles.page, { width: wp(100) }]}>
              <LessonAudioPanel
                character={lesson.hangeul_romanization}
                currentPage={currentPage}
                totalPages={totalPages}
                goToNext={goToNextPage}
                goToPrev={goToPrevPage}
                canvas={
                  <CanvasPage
                    character={lesson.hangeul_romanization}
                    onTouchEnd={() => {
                      markComplete(lesson.hangeul_romanization, "trace");
                    }}
                  />
                }
                onAudioPlayed={() =>
                  markComplete(lesson.hangeul_romanization, "audio")
                }
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
          currentQuestionNumber={completedCount}
          totalQuizNumber={totalPages}
        ></ProgressBar>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});
