// App.js
import QuizA from "@/components/QuizA";
import { usePathname } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useQuizLessons } from "@/hooks/useQuizLessons";
import BlueScreen from "@/components/BlueScreen";

const App = () => {
  // fetch path:
  const parts = usePathname().split("/").filter(Boolean);
  const { level, id: quizNum, quizQuestion } = useQuizLessons();

  return (
    <BlueScreen
      header={
        <View>
          <Text style={styles.grayed}>{parts.join(" ").toUpperCase()}</Text>
        </View>
      }
      content={
        <QuizA level={level} quizNum={quizNum} quizQuestion={quizQuestion} />
      }
    />
  );
};

export default App;
const styles = StyleSheet.create({
  grayed: {
    fontSize: 25,
    paddingHorizontal: 10,
    fontWeight: "bold",
    color: "gray",
  },
});
