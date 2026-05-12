// App.js
import QuizA from "@/components/QuizA";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BlueScreen from "@/components/BlueScreen";
import quizData from "@/app/data/quizzes_rows.json";
import { Quiz } from "@/types/quiz";

const App = () => {
  const [quizQuestion, setQuizQuestion] = useState<Quiz[]>([]);
  useEffect(() => {
    const quizzes = quizData
      .filter((q) => Number(q.level) === 5)
      .filter((q) => Number(q.quiz) === 1)
      .sort();

    if (quizzes) {
      // Shuffle the data
      const shuffledData = [...quizzes]; // create a copy
      for (let i = shuffledData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];

        setQuizQuestion(shuffledData as Quiz[]);
      }
    }
  }, []);
  return (
    <BlueScreen
      header={
        <View>
          <Text style={styles.grayed}>Final Quiz</Text>
        </View>
      }
      content={<QuizA level={"5"} quizNum={"1"} quizQuestion={quizQuestion} />}
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
