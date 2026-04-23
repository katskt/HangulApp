// components/FlashCards.tsx
import { useLessonAudio } from "@/hooks/useLessonAudio";
import { useResponsive } from "@/utils/responsive";
import React, { useEffect, useRef, useState } from "react";
import { Animated, PanResponder, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface Card {
  hangeul: string;
  audio: string;
  question: number;
}

interface FlashCardsProps {
  cards: Card[];
}

export default function FlashCards({ cards }: FlashCardsProps) {
  const { wp, hp } = useResponsive();
  const SWIPE_THRESHOLD = wp(25);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const { playCurrentAudio } = useLessonAudio(currentAudio);

  useEffect(() => {
    playCurrentAudio();
  }, [currentAudio]);

  const translateX = useRef(new Animated.Value(0)).current;
  const currentOpacity = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;
  const nextScale = useRef(new Animated.Value(0.95)).current;
  const isAnimating = useRef(false);

  const rotate = translateX.interpolate({
    inputRange: [-wp(100), 0, wp(100)],
    outputRange: ["-12deg", "0deg", "12deg"],
  });
  const cardOpacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isAnimating.current,
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
        // fade in next card as you drag
        const progress = Math.min(Math.abs(gesture.dx) / SWIPE_THRESHOLD, 1);
        nextOpacity.setValue(progress);
        nextScale.setValue(0.95 + progress * 0.05);
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
          isAnimating.current = true;
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: gesture.dx > 0 ? wp(100) * 1.5 : -wp(100) * 1.5,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(currentOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(nextOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(nextScale, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            translateX.setValue(0);
            cardOpacity.setValue(0); // hide instantly
            setCurrentIndex((prev) => (prev + 1) % cards.length);
            setNextIndex((prev) => (prev + 1) % cards.length);

            // show again after state update
            requestAnimationFrame(() => {
              cardOpacity.setValue(1);
            });
            isAnimating.current = false;
          });
        } else {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.spring(nextOpacity, { toValue: 0, useNativeDriver: true }),
            Animated.spring(nextScale, {
              toValue: 0.95,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "flex-start" },
    card: {
      position: "absolute",
      width: wp(80),
      height: hp(20),
      backgroundColor: "#fff",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
    },
    hangeul: { fontSize: 72, fontWeight: "bold" },
    question: {
      fontSize: 24,
      color: "#666",
      marginTop: 8,
    },
  });

  return (
    <View style={styles.container}>
      {/* Next card underneath */}
      <Animated.View
        style={[
          styles.card,
          {
            zIndex: 2,
            opacity: nextOpacity,
            transform: [{ scale: nextScale }],
          },
        ]}
      >
        <Text style={styles.question}>{cards[nextIndex]?.question}</Text>
        <Text style={styles.hangeul}>{cards[nextIndex]?.hangeul}</Text>
        <Icon name="volume-high" size={40} />
      </Animated.View>

      {/* Current card on top */}
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            zIndex: 3,
            opacity: cardOpacity,
            transform: [{ translateX }, { rotate }],
          },
        ]}
      >
        <Text style={styles.question}>{cards[currentIndex]?.question}</Text>
        <Text style={styles.hangeul}>{cards[currentIndex]?.hangeul}</Text>
        <Icon
          onPress={() => {
            setCurrentAudio(cards[currentIndex].audio);
            playCurrentAudio();
          }}
          name="volume-high"
          size={40}
        />
      </Animated.View>
    </View>
  );
}
