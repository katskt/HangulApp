// App.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { usePathname } from "expo-router";
import QuizB from "@/components/QuizB";

import BlueScreen from "@/components/BlueScreen";

const App = () => {
  // fetch path:
  const parts = usePathname().split("/").filter(Boolean);
  console.log(parts);

  return (
    <BlueScreen
      header={
        <Text style={styles.heading}>Listen and Select the Correct Answer</Text>
      }
      content={<QuizB />}
    />
  );
};

export default App;
const styles = StyleSheet.create({
  heading: {
    fontSize: 25,
    paddingHorizontal: 10,
    fontWeight: "bold",
    color: "black",
  },
});
