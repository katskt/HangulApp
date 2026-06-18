import { sharedStyles } from "@/theme/sharedStyles";
import { useThemeColors } from "@/theme/useThemeColors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
type BlueScreenProps = {
  header?: React.ReactNode; // header
  content?: React.ReactNode;
};

export default function BlueScreen({ header, content }: BlueScreenProps) {
  const router = useRouter();
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
                if (router.canGoBack()) {
                  router.dismiss();
                } else {
                  router.replace("/");
                }
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
