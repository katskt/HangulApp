import MyButton from "@/components/FunctionalButton";
import HalfSplashTemplate from "@/components/LessonBackgroundScreen";
import useCanvasPaths from "@/hooks/useLessonCanvas";
import { lessonStroke } from "@/lib/lessonStroke";
import { practiceImages } from "@/lib/practiceImages";
import { FontSizes, FontWeights, Typography } from "@/theme/typography";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import React from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";
import Icon from "react-native-vector-icons/Ionicons";
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
    //strokeImageUrl,
  } = useCanvasPaths(character);

  const { wp, hp } = useResponsive();
  const colors = useThemeColors();
  return (
    <HalfSplashTemplate
      topContent={
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: FontSizes.header,
              fontWeight: FontWeights.bold,
              fontFamily: Typography.english,
            }}
          >
            TRACE
          </Text>
        </View>
      }
      bottomContent={
        <View
          style={{
            justifyContent: "space-evenly",
            alignItems: "center",
            height: hp(70),
          }}
        >
          {image && (
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={practiceImages[character]} />
            </View>
          )}
          <View
            style={{
              position: "relative",
              borderWidth: wp(2),
              borderColor: colors.tint,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                height: Math.min(wp(85), hp(75)),
                width: Math.min(wp(85), hp(75)),
                /* backgroundColor: "white", */
                borderRadius: 40,
              }}
              onTouchStart={onTouchStart} //
              onTouchMove={onTouchMove}
              onTouchEnd={() => {
                finishStroke();
                onTouchEnd?.(); //
              }}
            >
              <ImageBackground
                style={styles.backgroundImage}
                source={lessonStroke[character]}
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
            <MyButton
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: hp(5),
                width: hp(5),
                backgroundColor: "(0, 0, 0, 0)",
              }}
              onPress={handleClear}
            >
              <Icon name="trash-outline" size={24} color="black" />
            </MyButton>
          </View>
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
    borderRadius: 5,
    resizeMode: "cover", // Default behavior, can be 'contain', 'repeat', etc.
    justifyContent: "center", // Centers children vertically
    alignItems: "center", // Centers children horizontally
  },
});
