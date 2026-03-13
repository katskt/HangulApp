//Quiz.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import AnimatedImage from "@components/AnimatedImage";
import Loading from "@components/Loading";
import { useQuizLessons } from "@/hooks/useQuizLessons";
import { useLessonAudio } from "@/hooks/useLessonAudio";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "@/components/FunctionalButton";
import SmallButton from "@components/SmallButton";
import { useThemeColors } from "@/theme/useThemeColors";

import { FontSizes, FontWeights } from "@/theme/typography";
const Quiz = () => {
  const imagey = require("@/assets/images/sejong.png");
  const colors = useThemeColors();
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

      // Move to next question after a short delay (so user can see correct highlight)
      setTimeout(() => {
        if (currentQuestion < quizQuestion.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null); // reset selection for next question
        } else {
          setQuizCompleted(true);
        }
      }, 500); // 500ms delay
    }
    if (selectedOption != quizQuestion[currentQuestion].correct_audio) {
      console.log("wrong");
    }
  };

  // HANDLE CLICK RETEST
  const handleRetest = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
  };

  // handle when data hasnt loaded yet

  if (!quizQuestion.length) return <Loading />;
  return (
    <View>
      {quizCompleted ? (
        // DISPLAY RESULT PAGE
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: FontSizes.header }}>참 잘했어요</Text>
          <AnimatedImage source={imagey} size={120} />
          <Button onPress={handleRetest}>
            <Icon name="refresh" size={24} color="black" />
          </Button>
        </View>
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
                  <Button onPress={playWrongAudio}>
                    {<Icon name="volume-high" size={40} />}
                  </Button>
                </View>
                <View style={styles.itemSideBySide}>
                  <Button
                    onPress={() => handleAnswer(currentQuiz!.wrong_audio)}
                  >
                    <Text></Text>
                  </Button>
                </View>
              </View>
              <View style={styles.containerSideBySide}>
                <View style={styles.itemSideBySide}>
                  <Button onPress={playCorrectAudio}>
                    {<Icon name="volume-high" size={40} />}
                  </Button>
                </View>
                <View style={styles.itemSideBySide}>
                  <Button
                    onPress={() => handleAnswer(currentQuiz!.correct_audio)}
                  >
                    <Text></Text>
                  </Button>
                </View>
              </View>
            </View>
          ) : (
            <View>
              {/* RIGHT, WRONG */}
              <View style={styles.containerSideBySide}>
                <View style={styles.itemSideBySide}>
                  <Button onPress={playCorrectAudio}>
                    {<Icon name="volume-high" size={40} />}
                  </Button>
                </View>
                <View style={styles.itemSideBySide}>
                  <Button
                    onPress={() => handleAnswer(currentQuiz!.correct_audio)}
                  >
                    <Text></Text>
                  </Button>
                </View>
              </View>
              <View style={styles.containerSideBySide}>
                <View style={styles.itemSideBySide}>
                  <Button onPress={playWrongAudio}>
                    {<Icon name="volume-high" size={40} />}
                  </Button>
                </View>
                <View style={styles.itemSideBySide}>
                  <Button
                    onPress={() => handleAnswer(currentQuiz!.wrong_audio)}
                  >
                    <Text></Text>
                  </Button>
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
    fontSize: FontSizes.hugeXL,
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
