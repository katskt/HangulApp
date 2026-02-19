import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import MyButton from "@/components/FunctionalButton";
import HalfSplashTemplate from "@/components/LessonBackgroundScreen";
import useCanvasPaths from "@/hooks/useLessonCanvas";
import useImage from "@/hooks/useImage";

const { height, width } = Dimensions.get("window");

// THIS PAGE NEEDS STROKE ORDER IMAGE.
interface CanvasPageProps {
  character: string;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  image?: boolean;
}

const STROKEWIDTH = 10;
export default function CanvasPage({
  character,
  image,
  onTouchStart,
  onTouchEnd,
}: CanvasPageProps) {
  const {
    paths,
    currentPath,
    onTouchMove,
    onTouchEnd: finishStroke,
    handleClear,
    strokeImageUrl,
  } = useCanvasPaths(character);

  const { imageUrl } = useImage(character);
  return (
    <HalfSplashTemplate
      topContent={
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 28, fontWeight: "bold" }}>Trace</Text>
        </View>
      }
      bottomContent={
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            {image && (
              <Image
                style={styles.image}
                source={
                  image
                    ? { uri: imageUrl }
                    : require("../assets/images/android-icon-foreground.png")
                }
              />
            )}
          </View>
          <View
            style={styles.svgContainer}
            onTouchStart={onTouchStart} //
            onTouchMove={onTouchMove}
            onTouchEnd={() => {
              finishStroke();
              onTouchEnd?.(); //
            }}
          >
            <ImageBackground
              style={styles.backgroundImage}
              source={
                strokeImageUrl
                  ? { uri: strokeImageUrl }
                  : require("../assets/images/android-icon-foreground.png")
              }
            >
              <View style={{ width: width * 0.9, aspectRatio: 1 }}>
                <Svg height={height * 0.7} width={width}>
                  {/* Completed strokes */}
                  {paths.map((stroke, i) => (
                    <Path
                      key={`path-${i}`}
                      d={stroke.join("")} // convert array → string
                      stroke="blue"
                      fill="transparent"
                      strokeWidth={STROKEWIDTH}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}

                  {currentPath.length > 0 && (
                    <Path
                      d={currentPath.join("")}
                      stroke="black"
                      fill="transparent"
                      strokeWidth={STROKEWIDTH}
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
  image: {
    width: 180,
    height: 180,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1, // This ensures the background fills the whole screen
    overflow: "hidden",
    borderRadius: 40,
    resizeMode: "cover", // Default behavior, can be 'contain', 'repeat', etc.
    justifyContent: "center", // Centers children vertically
    alignItems: "center", // Centers children horizontally
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
  svgContainer: {
    height: 300,
    width: 300,
    /* backgroundColor: "white", */
    borderRadius: 40,
    margin: 10,
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
