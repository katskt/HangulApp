import { sharedStyles } from "@/theme/sharedStyles";
import { useThemeColors } from "@/theme/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter, usePathname } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
type BlueScreenProps = {
  header?: React.ReactNode; // header
  content?: React.ReactNode;
};

export default function BlueScreen({ header, content }: BlueScreenProps) {
  const router = useRouter();
  const pathname = usePathname(); // e.g. "/path/to/place"
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: {
      paddingTop: header ? "12%" : 0,
      flex: 1,
      position: "relative",
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 15,
    },
    content: { height: "80%", paddingHorizontal: 15 },
  });
  const goBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      const parent = pathname.split("/").slice(0, -1).join("/") || "/";
      router.replace(parent as any);
    }
  };

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
                goBack();
              }}
              style={sharedStyles.iconButton}
            >
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {header && <View style={styles.header}>{header}</View>}
        <View style={styles.content}>{content}</View>
      </View>
    </>
  );
}
