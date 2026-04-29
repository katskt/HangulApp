// components/QuizComplete.tsx
import AnimatedImage from "@/components/AnimatedImage";
import Button from "@/components/FunctionalButton";
import FlashCards from "@/components/FlashCards";
import { FontSizes, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import Icon from "react-native-vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

interface Quiz {
  correct_hangeul: string;
  correct_audio: string;
}

interface QuizCompleteProps {
  quizQuestion: Quiz[];
  wrongAnswers: number[];
  onRetest: () => void;
}

export default function QuizComplete({
  quizQuestion,
  wrongAnswers,
  onRetest,
}: QuizCompleteProps) {
  const { wp, hp } = useResponsive();
  const colors = useThemeColors();
  const imagey = require("@/assets/images/sejong.png");

  return (
    <View style={{ height: hp(80), width: wp(90), alignSelf: "center" }}>
      <Button
        style={{ padding: wp(2), marginHorizontal: 0, flexDirection: "row" }}
        onPress={onRetest}
      >
        <Icon style={{ flex: 1 }} name="refresh" size={40} color="black" />
        <Text style={styles.buttonText}>Test Again</Text>
      </Button>

      <Text style={[styles.displayMessage, { color: colors.text }]}>
        Quiz Complete!
      </Text>

      <AnimatedImage
        style={{ zIndex: 4, alignSelf: "center" }}
        source={imagey}
        size={250}
      />

      <Text
        style={[
          styles.displayMessage,
          { alignSelf: "center", color: colors.text },
        ]}
      >
        Score: {quizQuestion.length - wrongAnswers.length}/{quizQuestion.length}
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
        {wrongAnswers.length === 0 ? "참잘했어요!" : "Missed Words"}
      </Text>

      {wrongAnswers.length !== 0 && (
        <FlashCards
          cards={wrongAnswers.map((l) => ({
            hangeul: quizQuestion[l].correct_hangeul,
            audio: quizQuestion[l].correct_audio,
            question: l + 1,
          }))}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  displayMessage: {
    fontSize: FontSizes.header,
    alignSelf: "center",
    fontFamily: Typography.english,
  },
  buttonText: {
    fontSize: FontSizes.header,
    fontFamily: Typography.english,
  },
});
