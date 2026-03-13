import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { sharedStyles } from "@/theme/sharedStyles";
import { Stack } from "expo-router";

import { usePathname } from "expo-router";
import { supabase } from "@/supabaseConfig";
import LessonAudioPanel from "@/components/LessonAudioPanel";
import CanvasPage from "@/components/TraceCanvas";
import { useThemeColors } from "@/theme/useThemeColors";
import { useLocalSearchParams } from "expo-router";
import Loading from "@components/Loading";

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
  const { level, consonantId } = useLocalSearchParams();
  const pathname = usePathname();
  const category = pathname.split("/")[3]; // gets "consonant"

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const colors = useThemeColors();
  /* DOTS FOR SCROLLING BEHAVIOR */
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = lessons.length * 2; // 2 pages per lesson
  /* END */

  // Fetch lessons
  useEffect(() => {
    if (!level || !category || !consonantId) return;

    const fetchLessons = async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("level", Number(level))
        .eq("category", category)
        .eq("group_romanization", consonantId)
        .order("order_index", { ascending: true });

      if (error) {
        console.error("Error fetching lessons:", error.message);
        return;
      }

      if (data) setLessons(data as Lesson[]);
    };

    fetchLessons();
  }, [level, category, consonantId]);

  if (!lessons.length)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <Loading />
      </View>
    );
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
          flexDirection: "row",
          justifyContent: "center",
          paddingVertical: 10,
          backgroundColor: colors.background,
        }}
      >
        {Array.from({ length: totalPages }).map((_, i) => (
          <View
            key={i}
            style={{
              width: i === currentPage ? 16 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === currentPage ? colors.tint : "gray",
              marginHorizontal: 4,
              marginBottom: "10%",
            }}
          />
        ))}
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
