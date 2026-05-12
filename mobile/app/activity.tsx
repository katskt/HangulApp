import BlueScreen from "@/components/BlueScreen";
import { supabase } from "@/supabaseConfig";
import { FontSizes, FontWeights } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { ScrollView, StyleSheet, Text, View } from "react-native";
interface ProgressRow {
  id: string;
  level: number;
  category: string;
  group: string;
  completed_at: string;
}

const getLabel = (item: ProgressRow) => {
  if (item.category === "quiz") return `한글 ${item.level} · ${item.group}`;
  if (item.category === "consonant")
    return `한글 ${item.level} · ${item.group}`;
  if (item.category === "vowel") return `한글 ${item.level} · ${item.group}`;
  if (item.category === "practice") return `한글 ${item.level} · ${item.group}`;
  return item.category;
};

export default function ActivityPage() {
  const { hp } = useResponsive();
  const colors = useThemeColors();
  const [progress, setProgress] = useState<ProgressRow[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });
      setProgress(data || []);
    };
    fetch();
  }, []);

  const now = Date.now();

  const ONE_HOUR = now - 1 * 60 * 60 * 1000;
  const ONE_DAY = now - 24 * 60 * 60 * 1000;
  const THREE_DAYS = now - 72 * 60 * 60 * 1000;

  const lastHour: ProgressRow[] = [];
  const lastDay: ProgressRow[] = [];
  const last3Days: ProgressRow[] = [];
  const older: ProgressRow[] = [];
  for (const item of progress) {
    const time = new Date(item.completed_at).getTime();

    if (time > ONE_HOUR) {
      lastHour.push(item);
    } else if (time > ONE_DAY) {
      lastDay.push(item);
    } else if (time > THREE_DAYS) {
      last3Days.push(item);
    } else {
      older.push(item);
    }
  }

  // group older items by date
  const olderByDay = older.reduce(
    (acc, item) => {
      const date = new Date(item.completed_at).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, ProgressRow[]>,
  );

  const categoryColor = (cat: string) => {
    if (cat === "quiz") return "#E1F5EE";
    if (cat === "practice") return "#FAEEDA";
    return "#EEEDFE"; // lesson - vowel or consonants
  };

  const renderSection = (title: string, items: ProgressRow[]) => {
    if (items.length === 0) return null;
    return (
      <View key={title} style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { fontSize: FontSizes.caption, color: colors.text },
          ]}
        >
          {title}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.foreground }]}>
          {items.map((item, i) => (
            <View
              key={item.completed_at}
              style={[
                styles.row,
                i < items.length - 1 && styles.rowBorder,
                { height: hp(8) },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: FontSizes.body,
                    fontWeight: FontWeights.medium,
                    color: "#000",
                  }}
                >
                  {getLabel(item)}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: categoryColor(item.category) },
                ]}
              >
                <Text style={{ fontSize: FontSizes.caption }}>
                  {item.category}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <BlueScreen
      header={
        <Text
          style={[
            styles.heading,
            {
              fontSize: FontSizes.header,
              fontWeight: FontWeights.bold,
              color: colors.text,
            },
          ]}
        >
          ACTIVITY
        </Text>
      }
      content={
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          {renderSection("Last hour", lastHour)}
          {renderSection("Last day", lastDay)}
          {renderSection("Last 3 days", last3Days)}
          {Object.entries(olderByDay).map(([date, items]) =>
            renderSection(date, items),
          )}
          {progress.length === 0 && <Loading />}
        </ScrollView>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heading: { marginBottom: 30 },
  section: { marginBottom: 20 },
  sectionTitle: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#eee",
    overflow: "hidden",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: "#eee" },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  empty: { textAlign: "center", marginTop: 40 },
});
