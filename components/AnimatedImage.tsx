import { useEffect, useRef } from "react";
import { Animated, ImageStyle, StyleProp } from "react-native";

export default function AnimatedImage({
  style,
  source,
  size = 120,
}: {
  style?: StyleProp<ImageStyle>;
  source: any;
  size?: number;
}) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 3.15, // pop bigger
          friction: 4,
          tension: 120,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250, // quick fade
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 3,
          duration: 1050, // spin
          useNativeDriver: true,
        }),
      ]),

      Animated.spring(scaleAnim, {
        toValue: 1, // settle back
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 3],
    outputRange: ["180deg", "0deg"],
  });

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={[
        style,
        {
          width: size,
          height: size,
          transform: [{ scale: scaleAnim }, { rotate }],
          opacity: opacityAnim,
        },
      ]}
    />
  );
}
