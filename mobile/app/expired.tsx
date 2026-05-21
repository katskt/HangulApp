import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useThemeColors } from "@/theme/useThemeColors";
import MyButton from "@/components/FunctionalButton";
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
export default function Expired() {
  const colors = useThemeColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
      marginBottom: 12,
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      textAlign: "center",
      color: colors.text,
      marginBottom: 24,
    },
    button: {
      backgroundColor: "#000",
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    buttonText: {
      fontSize: FontSizes.body,
      lineHeight: 0,
      padding: 10,
      fontWeight: FontWeights.semibold,
      letterSpacing: 0.25,
      color: colors.buttonText,
      fontFamily: Typography.english,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your class session has expired</Text>

      <Text style={styles.subtitle}>
        Please contact your teacher if you think this is a mistake.
      </Text>

      <MyButton onPress={() => router.replace("/login")}>
        <Text style={styles.buttonText}>Back to Login</Text>
      </MyButton>
    </View>
  );
}
