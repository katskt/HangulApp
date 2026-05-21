// App.js
import QuizB from "@/components/QuizB";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useQuizLessons } from "@/hooks/useQuizLessons";
import BlueScreen from "@/components/BlueScreen";
import { useRouteParams } from "@/hooks/useRouteParams";

const App = () => {
  // fetch path:
  const { level: levelName, id } = useRouteParams();
  const { level, id: quizNum, quizQuestion } = useQuizLessons();

  return (
    <BlueScreen
      header={
        <View>
          <Text style={styles.grayed}>
            한글 {levelName} QUIZ {id}B
          </Text>
        </View>
      }
      content={
        <QuizB level={level} quizNum={quizNum} quizQuestion={quizQuestion} />
      }
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
  grayed: {
    fontSize: 25,
    paddingHorizontal: 10,
    fontWeight: "bold",
    color: "gray",
  },
});
