import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export default function AnimatedImage({
  source,
  size = 120,
}: {
  source: any;
  size?: number;
}) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "0deg"],
  });

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={{
        width: size,
        height: size,
        transform: [{ scale: scaleAnim }, { rotate }],
        opacity: opacityAnim,
      }}
    />
  );
}
