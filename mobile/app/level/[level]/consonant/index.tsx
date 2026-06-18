import lessonsData from "@/app/data/lessons_rows.json";
import BlueScreen from "@/components/BlueScreen";
import MyButton from "@/components/FunctionalButton";
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { usePathname, useRouter, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import { useResponsive } from "@/utils/responsive";
import { sharedStyles } from "@/theme/sharedStyles";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/theme/useThemeColors";
interface Lesson {
  category: string;
  hangeul: string;
  order_index: number;
  level: number;
  hangeul_romanization: string;
  group: string | number;
  group_romanization: string | number;
  group_order: number;
}

export default function VowelPage() {
  // check page
  const { wp } = useResponsive();
  const router = useRouter();
  const colors = useThemeColors();
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const level = parts[1];
  const category = parts[2];
  const [lessons, setLessons] = useState<Lesson[]>([]);

  //fetch groups
  useEffect(() => {
    if (!level || !category) return;

    const seen = new Set();
    const data = lessonsData
      .filter(
        (l) => Number(l.level) === Number(level) && l.category === category,
      )
      .filter((l) => {
        if (seen.has(l.group)) return false;
        seen.add(l.group);
        return true;
      })
      .sort((a, b) => Number(a.group_order) - Number(b.group_order));

    setLessons(data);
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
        <ScrollView>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {lessons.map((lesson) => (
              <View
                key={lesson.hangeul_romanization}
                style={{ width: "50%", alignItems: "center" }}
              >
                <MyButton
                  style={{ height: wp(35), width: wp(35) }}
                  onPress={() =>
                    router.push(
                      `/level/${level}/${category}/${lesson.group_romanization}`,
                    )
                  }
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
                </MyButton>
              </View>
            ))}
          </View>
        </ScrollView>
      }
    />
  );
}
