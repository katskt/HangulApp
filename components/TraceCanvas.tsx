import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import MyButton from "@/components/FunctionalButton";
import HalfSplashTemplate from "@/components/LessonBackgroundScreen";
import useCanvasPaths from "@/hooks/useLessonCanvas";
const { height, width } = Dimensions.get("window");

// THIS PAGE NEEDS STROKE ORDER IMAGE.
interface CanvasPageProps {
  character: string;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
}

export default function CanvasPage({
  character,
  onTouchStart,
  onTouchEnd,
}: CanvasPageProps) {
  const {
    paths,
    currentPath,
    onTouchMove,
    onTouchEnd: finishStroke,
    handleClear,
    imageUrl,
  } = useCanvasPaths(character);

  return (
    <HalfSplashTemplate
      topContent={
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>Trace</Text>
        </View>
      }
      bottomContent={
        <View style={styles.container}>
          <View
            style={styles.svgContainer}
            onTouchStart={onTouchStart} // 🔑 disable scroll
            onTouchMove={onTouchMove}
            onTouchEnd={() => {
              finishStroke();
              onTouchEnd?.(); // 🔑 re-enable scroll
            }}
          >
            <ImageBackground
              style={styles.backgroundImage}
              source={
                imageUrl
                  ? { uri: imageUrl }
                  : require("../assets/images/android-icon-foreground.png")
              }
            >
              <View style={{ width: width * 0.9, aspectRatio: 1 }}>
                <Svg height={height * 0.7} width={width}>
                  {/* Completed strokes */}
                  {paths.map((stroke, i) => (
                    <Path
                      key={`path-${i}`}
                      d={stroke.join("")} // ✅ convert array → string
                      stroke="blue"
                      fill="transparent"
                      strokeWidth={15}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}

                  {currentPath.length > 0 && (
                    <Path
                      d={currentPath.join("")}
                      stroke="black"
                      fill="transparent"
                      strokeWidth={15}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </Svg>
              </View>
            </ImageBackground>
          </View>

          <MyButton onPress={handleClear} title="Clear" />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // This ensures the background fills the whole screen
    overflow: "hidden",
    borderRadius: 40,

    resizeMode: "cover", // Default behavior, can be 'contain', 'repeat', etc.
    justifyContent: "center", // Centers children vertically
    alignItems: "center", // Centers children horizontally
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  svgContainer: {
    height: height * 0.4,
    width: width * 0.9,
    /* backgroundColor: "white", */
    borderRadius: 40,
    margin: 20,
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
