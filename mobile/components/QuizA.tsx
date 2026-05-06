//Quiz.js

import Button from "@/components/FunctionalButton";
import ProgressBar from "@/components/ProgressBar";
import { useQuizAudio } from "@/hooks/useQuizAudio";
import QuizComplete from "@/components/QuizComplete";
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
interface QuizAProps {
  level: string;
  quizNum: string;
  quizQuestion: Quiz[]; // replace with your actual type
}
const QuizA = ({ level, quizNum, quizQuestion }: QuizAProps) => {
  // layout and sound effects
  const { wp, hp } = useResponsive();
  const { playCorrect, playWrong, playFinished } = useSoundEffects();
  const colors = useThemeColors();
  const { saveProgress } = useQuizProgress(Number(level), Number(quizNum), "A");

  // question and answer states
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [shuffledAnswer, setShuffledAnswers] = useState(0); // Shuffles answers
  const [quizCompleted, setQuizCompleted] = useState(false);

  // keeps track of wrong answers for flashcards
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);

  // Fetch Question Audio
  const { playAudio } = useQuizAudio();
  const currentQuiz =
    currentQuestion !== undefined ? quizQuestion[currentQuestion] : null;

  useEffect(() => {
    if (quizCompleted) {
      saveProgress();
      playFinished();
    }
  }, [quizCompleted]);

  useEffect(() => {
    if (!currentQuiz) return;

    // 1-bit randomizer: 0 or 1
    const coin = Math.random() < 0.5 ? 0 : 1;
    setShuffledAnswers(coin);
  }, [currentQuestion, currentQuiz]);

  // HANDLE USER ANSWER SELCTION

  const handleCheck = (selectedOption: string) => {
    setSelectedAnswer(selectedOption);
    if (selectedOption === quizQuestion[currentQuestion].correct_audio) {
      playCorrect();

      // Move to next question after a short delay (so user can see correct highlight)
      setTimeout(() => {
        if (currentQuestion < quizQuestion.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setQuizCompleted(true);
        }
        setSelectedAnswer(null);
      }, 1000); // 1000ms delay
    } else if (selectedOption === quizQuestion[currentQuestion].wrong_audio) {
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
    setWrongAnswers([]);
  };

  // handle when data hasnt loaded yet

  if (!quizQuestion.length) return <Loading />;
  return (
    <View
      style={{
        height: hp(85),
        width: wp(90),
        alignSelf: "center",
      }}
    >
      {quizCompleted ? (
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
          <Text
            style={[
              {
                color: colors.text,
                alignSelf: "center",
                fontFamily: Typography.english,
              },
              styles.displayMessage,
            ]}
          >
            Choose the Correct Audio
          </Text>
          {currentQuiz && (
            <Text style={[styles.word, { color: colors.text, height: hp(20) }]}>
              {currentQuiz.correct_hangeul}
            </Text>
          )}
          <View style={styles.containerSideBySide}>
            {/* RIGHT, WRONG */}
            <View style={styles.itemSideBySide}>
              <Button
                style={[
                  styles.option,
                  {
                    borderColor: colors.unselect,
                    height: hp(20),
                  },
                ]}
                onPress={() => {
                  playAudio(
                    shuffledAnswer == 1
                      ? currentQuiz!.correct_audio
                      : currentQuiz!.wrong_audio,
                  );
                }}
              >
                {<Icon name="volume-high" size={40} />}
              </Button>
              <Button
                style={styles.option}
                onPress={() => {
                  handleCheck(
                    shuffledAnswer == 1
                      ? currentQuiz!.correct_audio
                      : currentQuiz!.wrong_audio,
                  );
                }}
              >
                <Text style={[styles.buttonText, { padding: hp(2) }]}></Text>
              </Button>
            </View>
            <View style={styles.itemSideBySide}>
              <Button
                style={[
                  styles.option,
                  {
                    borderColor: colors.unselect,
                    height: hp(20),
                  },
                ]}
                onPress={() => {
                  playAudio(
                    shuffledAnswer == 1
                      ? currentQuiz!.wrong_audio
                      : currentQuiz!.correct_audio,
                  );
                }}
              >
                {<Icon name="volume-high" size={40} />}
              </Button>
              <Button
                style={styles.option}
                onPress={() => {
                  handleCheck(
                    shuffledAnswer == 1
                      ? currentQuiz!.wrong_audio
                      : currentQuiz!.correct_audio,
                  );
                }}
              >
                <Text style={[styles.buttonText, { padding: hp(2) }]}></Text>
              </Button>
            </View>
          </View>

          <Text
            style={[
              {
                color: colors.text,
                alignSelf: "center",
                fontFamily: Typography.english,
              },
              ,
              styles.displayMessage,
            ]}
          >
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
  displayMessage: {
    alignSelf: "center",
    fontFamily: Typography.english,
    fontSize: FontSizes.header,
  },
  wrongAnswers: {
    color: "#000000",
    fontSize: FontSizes.header,
    alignSelf: "center",
    fontFamily: Typography.english,
  },
  containerSideBySide: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  itemSideBySide: {
    flex: 1,
    width: "45%",
  },

  option: {
    width: "90%",
    borderWidth: 6,
  },

  word: {
    fontSize: FontSizes.hugeXL,
    fontFamily: Typography.default,
    alignSelf: "center",
  },
  buttonText: {
    fontSize: FontSizes.header,
    fontWeight: FontWeights.bold,
    fontFamily: Typography.english,
    alignSelf: "center",
  },
});
export default QuizA;
