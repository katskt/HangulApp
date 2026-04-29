import lessonsData from "@/app/data/lessons_rows.json";
import LessonAudioPanel from "@/components/LessonAudioPanel";
import ProgressBar from "@/components/ProgressBar";
import CanvasPage from "@/components/TraceCanvas";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { sharedStyles } from "@/theme/sharedStyles";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import Loading from "@components/Loading";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const parts = usePathname().split("/").filter(Boolean);

  const { wp, hp } = useResponsive();
  const { level, category, id } = useRouteParams();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const colors = useThemeColors();
  const totalPages = lessons.length; // 1 page per lesson

  const { markComplete, completedCount } = useLessonProgress(
    lessons,
    level,
    category, // "consonant", "vowel", or "practice"
  );

  // Fetch lessons
  useEffect(() => {
    if (!level || !category || !id) return;
    const data = lessonsData
      .filter(
        (l) =>
          Number(l.level) === Number(level) &&
          l.category === category &&
          l.hangeul_romanization === id,
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
      <View
        style={{
          alignItems: "flex-end",
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{
            fontSize: 25,
            paddingHorizontal: 10,
            fontWeight: "bold",
            color: "gray",
          }}
        >
          LISTEN & COMPARE
        </Text>
      </View>
      <ScrollView
        scrollEventThrottle={16}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        style={{ width: wp(100), flex: 1, backgroundColor: colors.background }}
      >
        {lessons.map((lesson) => (
          <React.Fragment key={lesson.order_index}>
            {/* Page 1: Audio Panel */}
            <View style={[styles.page, { width: wp(100) }]}>
              <LessonAudioPanel
                character={lesson.hangeul_romanization}
                canvas={
                  <CanvasPage
                    character={lesson.hangeul_romanization}
                    onTouchStart={() => setScrollEnabled(false)}
                    onTouchEnd={() => {
                      setScrollEnabled(true);
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
