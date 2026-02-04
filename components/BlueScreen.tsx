import React from "react";
import { View, StyleSheet } from "react-native";

import { useThemeColors } from "../theme/useThemeColors";

type BlueScreenProps = {
  header?: React.ReactNode; // header
  content?: React.ReactNode;
};

export default function BlueScreen({ header, content }: BlueScreenProps) {
  const colors = useThemeColors();
  const styles = StyleSheet.create({
    container: {
      paddingTop: "20%",
      flex: 1,
      position: "relative",
      backgroundColor: colors.background,
      /*       borderWidth: 2,
      borderColor: "red", */
    },
    header: {
      height: "10%",
      position: "relative",
      marginVertical: 20,
      flexDirection: "row",
      flex: 1,
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    content: { height: "80%", paddingHorizontal: 15 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>{header}</View>
      <View style={styles.content}>{content}</View>
    </View>
  );
}
