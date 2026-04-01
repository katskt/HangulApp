//Quiz.js

import AnimatedImage from "@/components/AnimatedImage";
import FlashCards from "@/components/FlashCards";
import Button from "@/components/FunctionalButton";
import ProgressBar from "@/components/ProgressBar";
import { useLessonAudio } from "@/hooks/useLessonAudio";

import { useQuizLessons } from "@/hooks/useQuizLessons";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import Loading from "@components/Loading";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Quiz = () => {
  const { wp, hp } = useResponsive();
  const imagey = require("@/assets/images/sejong.png");
  const { playCorrect, playWrong, playFinished } = useSoundEffects();

  const colors = useThemeColors();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shuffledAnswer, setShuffledAnswers] = useState(0); // Shuffles answers
  const [score, setScore] = useState(0); // counts # correct
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { quizQuestion } = useQuizLessons();
  const [selectedCheck, setSelectedCheck] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  const currentQuiz =
    currentQuestion !== undefined ? quizQuestion[currentQuestion] : null;
  const correct_audio = currentQuiz?.correct_audio ?? null;

  useEffect(() => {
    if (quizCompleted) {
      playFinished();
    }
  }, [quizCompleted]);

  useEffect(() => {
    playReference();
  }, [score]);

  useEffect(() => {
    if (!currentQuiz) return;

    // 1-bit randomizer: 0 or 1
    const coin = Math.random() < 0.5 ? 0 : 1;
    setShuffledAnswers(coin);
  }, [currentQuestion, currentQuiz]);

  // Fetch Question Audio
  const { playReference } = useLessonAudio(currentAudio);

  // HANDLE USER ANSWER SELCTION
  const handleAnswer = (selectedOption: string) => {
    setSelectedCheck(false);
    setSelectedAnswer(selectedOption);
  };

  const handleCheck = () => {
    setSelectedCheck(true);
    if (selectedAnswer === quizQuestion[currentQuestion].correct_audio) {
      playCorrect();
      setScore(score + 1);

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
    if (selectedAnswer === quizQuestion[currentQuestion].wrong_audio) {
      playWrong();
      setWrongAnswers((prev) =>
        prev.includes(currentQuestion) ? prev : [...prev, currentQuestion],
      );
    }
  };
  useEffect(() => {
    setCurrentAudio(correct_audio);
    playReference();
  }, [currentQuestion, currentQuiz]);
  // HANDLE CLICK RETEST
  const handleRetest = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedAnswer(null);
    setWrongAnswers([]);
  };

  useEffect(() => {
    playReference();
  }, [currentAudio]);

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
        <View
          style={{
            height: hp(80),
            width: wp(90),
            alignSelf: "center",
          }}
        >
          <Button
            style={{
              marginHorizontal: 0,
              flexDirection: "row",
            }}
            onPress={handleRetest}
          >
            <Icon style={{ flex: 1 }} name="refresh" size={40} color="black" />
            <Text style={styles.buttonText}>Test Again</Text>
          </Button>
          <Text style={styles.displayMessage}>Quiz Complete!</Text>
          <AnimatedImage
            style={{ zIndex: 4, alignSelf: "center" }}
            source={imagey}
            size={250}
          />

          <Text
            style={[
              { alignSelf: "center", color: colors.text },
              styles.displayMessage,
            ]}
          >
            Score: {quizQuestion.length - wrongAnswers.length}/
            {quizQuestion.length}
          </Text>
          <Text
            style={[
              styles.displayMessage,

              {
                alignSelf: "center",
                color: colors.text,
                fontSize: FontSizes.body,
              },
            ]}
          >
            {wrongAnswers.length === 0 ? "참잘했어요!" : `Missed Words`}
          </Text>
          {wrongAnswers.length != 0 && (
            <FlashCards
              cards={wrongAnswers.map((l) => ({
                hangeul: quizQuestion[l].correct_hangeul,
                audio: quizQuestion[l].correct_audio,
                question: l + 1,
              }))}
            />
          )}
        </View>
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
                setCurrentAudio(correct_audio);
                playReference();
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
          {shuffledAnswer == 1 ? (
            <View>
              <Button
                style={[
                  styles.option,
                  {
                    borderColor:
                      selectedAnswer === currentQuiz!.correct_audio
                        ? colors.select
                        : colors.unselect,
                  },
                ]}
                onPress={() => handleAnswer(currentQuiz!.correct_audio)}
              >
                <Text style={styles.answers}>
                  {currentQuiz?.correct_hangeul}
                </Text>
              </Button>

              <Button
                style={[
                  styles.option,
                  {
                    borderColor:
                      selectedAnswer === currentQuiz!.wrong_audio
                        ? colors.select
                        : colors.unselect,
                  },
                ]}
                onPress={() => handleAnswer(currentQuiz!.wrong_audio)}
              >
                <Text style={styles.answers}>{currentQuiz?.wrong_hangeul}</Text>
              </Button>
            </View>
          ) : (
            <View>
              <Button
                style={[
                  styles.option,
                  {
                    borderColor:
                      selectedAnswer === currentQuiz!.wrong_audio
                        ? colors.select
                        : colors.unselect,
                  },
                ]}
                onPress={() => handleAnswer(currentQuiz!.wrong_audio)}
              >
                <Text style={styles.answers}>{currentQuiz?.wrong_hangeul}</Text>
              </Button>
              <Button
                style={[
                  styles.option,
                  {
                    borderColor:
                      selectedAnswer === currentQuiz!.correct_audio
                        ? colors.select
                        : colors.unselect,
                  },
                ]}
                onPress={() => handleAnswer(currentQuiz!.correct_audio)}
              >
                <Text style={styles.answers}>
                  {currentQuiz?.correct_hangeul}
                </Text>
              </Button>
            </View>
          )}
          <Text style={styles.displayMessage}>
            {selectedAnswer && selectedCheck
              ? selectedAnswer === currentQuiz!.correct_audio
                ? "Nice!"
                : selectedAnswer === currentQuiz!.wrong_audio
                  ? "Try Again...!"
                  : null
              : null}
          </Text>
          <Button
            style={{ marginTop: "auto", bottom: 0, left: 0, right: 0 }}
            onPress={() => {
              handleCheck();
            }}
          >
            <Text style={styles.buttonText}>CHECK</Text>
          </Button>
        </View>
      )}
    </View>
  );
};

export default Quiz;
