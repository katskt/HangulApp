//Quiz.js

import Button from "@/components/FunctionalButton";
import ProgressBar from "@/components/ProgressBar";
import QuizComplete from "@/components/QuizComplete";
import { useQuizAudio } from "@/hooks/useQuizAudio";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import Loading from "@components/Loading";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Quiz } from "@/types/quiz";
interface QuizBProps {
  level: string;
  quizNum: string;
  quizQuestion: Quiz[]; // replace with your actual type
}
const QuizB = ({ level, quizNum, quizQuestion }: QuizBProps) => {
  const { wp, hp } = useResponsive();
  const { playCorrect, playWrong, playFinished } = useSoundEffects();

  const colors = useThemeColors();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shuffledAnswer, setShuffledAnswers] = useState(0); // Shuffles answers
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);

  const currentQuiz =
    currentQuestion !== undefined ? quizQuestion[currentQuestion] : null;
  const correct_audio = currentQuiz?.correct_audio ?? null;

  useEffect(() => {
    playAudio(correct_audio);
  }, [correct_audio]);
  const { saveProgress } = useQuizProgress(Number(level), Number(quizNum), "B");

  useEffect(() => {
    if (quizCompleted) {
      saveProgress();
      playFinished();
    }
  }, [quizCompleted]);

  // shuffle answers mechanism
  useEffect(() => {
    if (!currentQuiz) return;

    // 1-bit randomizer: 0 or 1
    const coin = Math.random() < 0.5 ? 0 : 1;
    setShuffledAnswers(coin);
  }, [currentQuestion, currentQuiz]);

  // Fetch Question Audio
  const { playAudio } = useQuizAudio();

  const handleCheck = (selectedOption: string) => {
    setSelectedCheck(true);
    setSelectedAnswer(selectedOption);
    if (selectedOption === quizQuestion[currentQuestion].correct_audio) {
      playCorrect();
      // Move to next question after a short delay (so user can see correct highlight)
      setTimeout(() => {
        if (currentQuestion < quizQuestion.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null); // reset selection for next question
        } else {
          setQuizCompleted(true);
        }
        setSelectedCheck(false);
      }, 1000); // 1000ms delay
    }
    if (selectedOption === quizQuestion[currentQuestion].wrong_audio) {
      playWrong();
      setWrongAnswers((prev) =>
        prev.includes(currentQuestion) ? prev : [...prev, currentQuestion],
      );
    }
  };

  // HANDLE CLICK RETEST
  const handleRetest = () => {
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setWrongAnswers([]);
  };

  // handle when data hasnt loaded yet
  if (!quizQuestion.length) return <Loading />;

  const styles = StyleSheet.create({
    answers: {
      fontSize: FontSizes.huge,
      fontFamily: Typography.default,
    },
    wrongAnswersButton: {
      marginHorizontal: 0,
      margin: hp(2),
      flexDirection: "row",
      borderRadius: 40,
      borderWidth: 1,
      borderColor: "#EEE",
      padding: wp(2),
    },
    wrongAnswersText: {
      color: "#000000",
      fontSize: FontSizes.huge,
      alignSelf: "center",
      fontFamily: Typography.default,
    },
    displayMessage: {
      fontFamily: Typography.english,
      fontSize: FontSizes.header,
      alignSelf: "center",
      color: colors.text,
    },
    option: {
      borderColor: colors.unselect,
      height: hp(20),
      borderWidth: 6,
    },
    word: {
      fontSize: FontSizes.hugeXL,
      fontFamily: Typography.default,
      color: colors.text,
      alignSelf: "center",
      height: hp(20),
    },
    buttonText: {
      fontSize: FontSizes.header,
      fontWeight: FontWeights.bold,
      fontFamily: Typography.english,
      alignSelf: "center",
      padding: hp(2),
    },
  });
  return (
    <View>
      {quizCompleted ? (
        // DISPLAY RESULT PAGE
        <QuizComplete
          quizQuestion={quizQuestion}
          wrongAnswers={wrongAnswers}
          onRetest={handleRetest}
        />
      ) : (
        // DISPLAY QUIZ QUESTION
        <View style={{ height: hp(80), width: wp(90), alignSelf: "center" }}>
          <ProgressBar
            currentQuestionNumber={currentQuestion}
            totalQuizNumber={quizQuestion.length}
          ></ProgressBar>
          <Text style={styles.displayMessage}>What Do You Hear?</Text>

          {currentQuiz && (
            <Button
              onPress={() => {
                playAudio(correct_audio);
              }}
              style={{
                backgroundColor: "#FFF9E7",
                width: wp(50),
                alignSelf: "center",
                borderWidth: 10,
                borderColor: "#ded2ad63",
                borderRadius: 50,
              }}
            >
              <Icon name="volume-high" size={40} />
            </Button>
          )}
          <View>
            <Button
              style={[styles.option]}
              onPress={() => {
                handleCheck(
                  shuffledAnswer === 1
                    ? currentQuiz!.correct_audio
                    : currentQuiz!.wrong_audio,
                );
              }}
            >
              <Text style={styles.answers}>
                {shuffledAnswer === 1
                  ? currentQuiz!.correct_hangeul
                  : currentQuiz!.wrong_hangeul}
              </Text>
            </Button>

            <Button
              style={styles.option}
              onPress={() => {
                handleCheck(
                  shuffledAnswer === 1
                    ? currentQuiz!.wrong_audio
                    : currentQuiz!.correct_audio,
                );
              }}
            >
              <Text style={styles.answers}>
                {shuffledAnswer === 1
                  ? currentQuiz!.wrong_hangeul
                  : currentQuiz!.correct_hangeul}
              </Text>
            </Button>
          </View>
          <Text style={styles.displayMessage}>
            {selectedAnswer && selectedCheck
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

export default QuizB;
