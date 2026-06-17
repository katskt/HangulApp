// app/index.tsx
import MyButton from "@/components/FunctionalButton";
import SplashTemplate from "@/components/TemplateScreen"; // adjust path to your template
import { getLevelImage } from "@/lib/levelAssets";
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View, Linking } from "react-native";
import { useGetUser } from "@/hooks/useGetUser";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { signOut } from "@/supabaseConfig";
import AppModal from "@/components/AppModal";
import { useState } from "react";

export default function HomeScreen() {
  const url =
    "https://www.notion.so/UCSB-Hangeul-36fdd73c4cb4806d943bedbb1c538222";
  const [visible, setVisible] = useState(false);

  const logOut = async () => {
    await signOut();
    router.replace("/login");
    router.dismissAll(); // clears stacked routes (important)
  };

  const { hp } = useResponsive();
  const router = useRouter();
  const colors = useThemeColors();
  const { firstName } = useGetUser();

  const levels = [
    { level_number: 1, title: "1" },
    { level_number: 2, title: "2" },
    { level_number: 3, title: "3" },
    { level_number: 4, title: "4" },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    buttonImage: {
      position: "absolute",
      width: "100%",
      height: "100%",
      opacity: 0.9,
    },
    buttonText: {
      padding: 20,
      fontSize: FontSizes.h3,
      fontFamily: Typography.english,
      color: colors.buttonText,
    },
  });

  return (
    <SplashTemplate
      // Top 1/3 content: put text, logo, etc.
      topContent={
        <View style={{ flex: 1, width: "100%" }}>
          {/* Top-left: Help */}
          <View style={{ position: "absolute", top: 0, left: 0 }}>
            <MyButton
              style={{ borderWidth: 0, backgroundColor: colors.background }}
              onPress={() => setVisible(true)}
            >
              <FontAwesome6
                name="person-circle-question"
                size={24}
                color="black"
              />
            </MyButton>
          </View>

          {/* Top-right: Log Out */}
          <View style={{ position: "absolute", top: 0, right: 0 }}>
            <MyButton
              onPress={logOut}
              style={{ borderWidth: 0, backgroundColor: colors.background }}
            >
              <Feather name="log-out" size={24} color="black" />
            </MyButton>
          </View>
        </View>
      }
      // Bottom 2/3 content: buttons, forms, other components
      bottomContent={
        <View style={{ height: "95%" }}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: FontSizes.header,
                fontWeight: FontWeights.bold,
                fontFamily: Typography.default,
                color: colors.text,
              }}
            >
              안녕하세요 {firstName}!
            </Text>
          </View>
          <MyButton onPress={() => router.push("/activity")}>
            <Text style={styles.buttonText}>ACTIVITY</Text>
          </MyButton>

          <AppModal
            visible={visible}
            onClose={() => setVisible(false)}
            title="Hello!"
          >
            <Text>
              This app was developed by Katie Pyo under the guidance of Wona
              Lee, Ph.D., to support the Korean 1 curriculum at UCSB. For
              questions or feedback, please visit{" "}
              <Text
                style={{ color: "#0066cc", textDecorationLine: "underline" }}
                onPress={() => Linking.openURL(url)}
              >
                this page
              </Text>
              .
            </Text>
            <MyButton onPress={() => setVisible(false)}>
              <Text>Close</Text>
            </MyButton>
          </AppModal>

          <View
            style={[styles.container, { backgroundColor: colors.background }]}
          >
            {levels.map((level) => (
              <MyButton
                key={level.level_number}
                style={{
                  width: hp(17),
                  height: hp(17),
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
                onPress={() => router.push(`/level/${level.level_number}`)}
              >
                <Image
                  source={getLevelImage(level.level_number)}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: 5,
                  }}
                  resizeMode="contain"
                />
                <Text style={[styles.buttonText, { fontSize: FontSizes.huge }]}>
                  {level.title}
                </Text>
              </MyButton>
            ))}
          </View>
          <View style={{ flexDirection: "row" }}>
            <MyButton
              style={{ flex: 1 }}
              onPress={() => router.push("/finalQuizA")}
            >
              <Text style={styles.buttonText}>Final Quiz A</Text>
            </MyButton>
            <MyButton
              style={{ flex: 1 }}
              onPress={() => router.push("/finalQuizB")}
            >
              <Text style={styles.buttonText}>Final Quiz B</Text>
            </MyButton>
          </View>
        </View>
      }
    />
  );
}
