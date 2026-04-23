//Quiz.js

import FlashCards from "@/components/FlashCards";
import Button from "@/components/FunctionalButton";
import ProgressBar from "@/components/ProgressBar";
import { useLessonAudio } from "@/hooks/useLessonAudio";
import { useQuizLessons } from "@/hooks/useQuizLessons";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import AnimatedImage from "@components/AnimatedImage";
import Loading from "@components/Loading";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
const Quiz = () => {
  const { wp, hp } = useResponsive();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { playCorrect, playWrong, playFinished } = useSoundEffects();
  const colors = useThemeColors();
  const imagey = require("@/assets/images/sejong.png");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [shuffledAnswer, setShuffledAnswers] = useState(0); // Shuffles answers
  const [score, setScore] = useState(0); // counts # correct
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);

  // Fetch Question Audio
  const { playOnLoad, playCurrentAudio } = useLessonAudio(currentAudio);
  const { level, id: quizNum, quizQuestion } = useQuizLessons();
  const currentQuiz =
    currentQuestion !== undefined ? quizQuestion[currentQuestion] : null;

  useEffect(() => {
    playCurrentAudio();
  }, [score]);

  const { saveProgress } = useQuizProgress(Number(level), Number(quizNum), "A");

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
      setCurrentAudio(currentQuiz!.correct_audio);
      setScore(score + 1);

      // Move to next question after a short delay (so user can see correct highlight)
      setTimeout(() => {
        if (currentQuestion < quizQuestion.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
        } else {
          setQuizCompleted(true);
        }
        setSelectedAnswer(null);
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
    setScore(0);
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
            <Text style={[styles.buttonText, { padding: hp(2) }]}>
              Test Again
            </Text>
          </Button>
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
            Quiz Complete!
          </Text>
          <AnimatedImage
            style={{ zIndex: 4, alignSelf: "center" }}
            source={imagey}
            size={wp(20)}
          />
          <Text
            style={[
              ,
              styles.displayMessage,
              { alignSelf: "center", color: colors.text, padding: hp(2) },
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
                padding: 10,
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
                  setCurrentAudio(
                    shuffledAnswer == 1
                      ? currentQuiz!.correct_audio
                      : currentQuiz!.wrong_audio,
                  );
                  playOnLoad();
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
                  setCurrentAudio(
                    shuffledAnswer == 1
                      ? currentQuiz!.wrong_audio
                      : currentQuiz!.correct_audio,
                  );
                  playOnLoad();
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
export default Quiz;
