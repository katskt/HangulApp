//Quiz.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useQuizLessons } from "@/hooks/useQuizLessons";
import { useLessonAudio } from "@/hooks/useLessonAudio";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "@/components/FunctionalButton";
import SmallButton from "@components/SmallButton";
import { FontSizes, FontWeights } from "@/theme/typography";
const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shuffledAnswer, setShuffledAnswers] = useState(0); // Shuffles answers
  const [score, setScore] = useState(0); // counts # correct
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { quizQuestion } = useQuizLessons();

  const currentQuiz =
    currentQuestion !== undefined ? quizQuestion[currentQuestion] : null;
  const correct_audio = currentQuiz?.correct_audio ?? null;
  const wrong_audio = currentQuiz?.wrong_audio ?? null;

  console.log("PEEPEEPOOPOO", quizQuestion);
  useEffect(() => {
    if (!currentQuiz) return;

    // 1-bit randomizer: 0 or 1
    const coin = Math.random() < 0.5 ? 0 : 1;
    setShuffledAnswers(coin);
  }, [currentQuestion, currentQuiz]);

  // Fetch Question Audio
  const { playReference: playCorrectAudio } = useLessonAudio(correct_audio);
  const { playReference: playWrongAudio } = useLessonAudio(wrong_audio);

  // HANDLE USER ANSWER SELCTION
  const handleAnswer = (selectedOption: string) => {
    setSelectedAnswer(selectedOption);

    if (selectedOption === quizQuestion[currentQuestion].correct_audio) {
      setScore(score + 1);

      // Move to next question after a short delay (so user can see red highlight)
      setTimeout(() => {
        if (currentQuestion < quizQuestion.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null); // reset selection for next question
        } else {
          setQuizCompleted(true);
        }
      }, 500); // 500ms delay
    }
  };

  // HANDLE CLICK RETEST
  const handleRetest = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
  };

  // handle when data hasnt loaded yet
  if (quizQuestion.length === 0) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View>
      {quizCompleted ? (
        // DISPLAY RESULT PAGE
        <ScrollView>
          <Text>Good Job!</Text>
          <Button title={"Retest"} onPress={handleRetest}></Button>
        </ScrollView>
      ) : (
        // DISPLAY QUIZ QUESTION
        <View>
          {currentQuiz && (
            <Text style={styles.question}>{currentQuiz.correct_hangeul}</Text>
          )}
          {shuffledAnswer == 1 ? (
            <View>
              {/* WRONG, RIGHT */}
              <View style={styles.containerSideBySide}>
                <View style={styles.itemSideBySide}>
                  <Button
                    title={<Icon name="volume-high" size={40} />}
                    onPress={playWrongAudio}
                  ></Button>
                </View>
                <View style={styles.itemSideBySide}>
                  <Button
                    title={""}
                    onPress={() => handleAnswer(currentQuiz!.wrong_audio)}
                  ></Button>
                </View>
              </View>
              <View style={styles.containerSideBySide}>
                <View style={styles.itemSideBySide}>
                  <Button
                    title={<Icon name="volume-high" size={40} />}
                    onPress={playCorrectAudio}
                  ></Button>
                </View>
                <View style={styles.itemSideBySide}>
                  <Button
                    title={""}
                    onPress={() => handleAnswer(currentQuiz!.correct_audio)}
                  ></Button>
                </View>
              </View>
            </View>
          ) : (
            <View>
              {/* RIGHT, WRONG */}
              <View style={styles.containerSideBySide}>
                <View style={styles.itemSideBySide}>
                  <Button
                    title={<Icon name="volume-high" size={40} />}
                    onPress={playCorrectAudio}
                  ></Button>
                </View>
                <View style={styles.itemSideBySide}>
                  <Button
                    title={" "}
                    onPress={() => handleAnswer(currentQuiz!.correct_audio)}
                  />
                </View>
              </View>
              <View style={styles.containerSideBySide}>
                <View style={styles.itemSideBySide}>
                  <Button
                    title={<Icon name="volume-high" size={40} />}
                    onPress={playWrongAudio}
                  />
                </View>
                <View style={styles.itemSideBySide}>
                  <Button
                    title={" "}
                    onPress={() => handleAnswer(currentQuiz!.wrong_audio)}
                  />
                </View>
              </View>
            </View>
          )}
          <Text style={styles.displayMessage}>
            {selectedAnswer
              ? selectedAnswer === currentQuiz!.correct_audio
                ? "Nice!"
                : selectedAnswer === currentQuiz!.wrong_audio
                  ? "Try Again...!"
                  : null
              : null}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  question: {
    fontSize: FontSizes.huge,
    margin: "auto",
    padding: 10,
  },
  displayMessage: {
    fontSize: FontSizes.header,
    margin: "auto",
  },
  containerSideBySide: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: 100,
  },
  itemSideBySide: {
    flex: 1,
    width: "50%",
  },
});
export default Quiz;
