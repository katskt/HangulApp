import { StyleSheet } from "react-native";

export const sharedStyles = StyleSheet.create({
  iconButton: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
    padding: 6,
  }
});
/* 
// usage:
import { sharedStyles } from "@/theme/sharedStyles";
style={sharedStyles.iconButton} */