import lessonsData from "@/app/data/lessons_rows.json";
import LessonAudioPanel from "@/components/LessonAudioPanel";
import Loading from "@/components/Loading";
import ProgressBar from "@/components/ProgressBar";
import CanvasPage from "@/components/TraceCanvas";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { sharedStyles } from "@/theme/sharedStyles";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
import { useRouteParams } from "@/hooks/useRouteParams";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";

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
  const router = useRouter();
  const { level, category, id } = useRouteParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const colors = useThemeColors();

  const totalPages = lessons.length; // 1 page per lesson

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
    if (!level || !category) return;
    const data = lessonsData
      .filter(
        (l) =>
          Number(l.level) === Number(level) &&
          l.category === category &&
          l.group_order === Number(id),
      )
      .sort((a, b) => a.order_index - b.order_index);
    setLessons(data);
  }, [id, level, category]);

  if (!lessons.length) return <Loading />;
  return (
    <>
      <View style={{ backgroundColor: colors.background }}>
        <Text
          style={{
            fontSize: 25,
            paddingHorizontal: 10,
            fontWeight: "bold",
            color: "gray",
            alignSelf: "flex-end",
          }}
        >
          힌글 {level} {category.toUpperCase()} {id}
        </Text>
      </View>
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
        pagingEnabled
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        {lessons.map((lesson) => (
          <React.Fragment key={lesson.order_index}>
            {/* Page */}
            <View style={[styles.page, { width: wp(100) }]}>
              <LessonAudioPanel
                currentPage={currentPage}
                totalPages={totalPages}
                goToNext={goToNextPage}
                goToPrev={goToPrevPage}
                character={lesson.hangeul_romanization}
                canvas={
                  <CanvasPage
                    character={lesson.hangeul_romanization}
                    onTouchEnd={() => {
                      markComplete(lesson.hangeul_romanization, "trace");
                    }}
                    image={true}
                  />
                }
                image={true}
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
