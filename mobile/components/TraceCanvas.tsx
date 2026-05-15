import useCanvasPaths from "@/hooks/useLessonCanvas";
import { lessonStroke } from "@/lib/lessonStroke";
import { useThemeColors } from "@/theme/useThemeColors";
import { useResponsive } from "@/utils/responsive";
import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Path, Svg } from "react-native-svg";
// THIS PAGE NEEDS STROKE ORDER IMAGE.

interface CanvasPageProps {
  character: string;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  image?: boolean;
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
    //strokeImageUrl,
  } = useCanvasPaths(character);

  const { wp, hp } = useResponsive();
  const strokeWidth = wp(2);

  const colors = useThemeColors();
  return (
    <View
      style={{
        position: "relative",
        borderWidth: wp(2),
        borderColor: paths.length !== 0 ? colors.select : colors.unselect,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          height: Math.min(wp(85), hp(50)),
          width: Math.min(wp(85), hp(50)),
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
          <View style={{ width: wp(90), aspectRatio: 1 }}>
            <Svg height={hp(70)} width={wp(100)}>
              {/* Completed strokes */}
              {paths.map((stroke, i) => (
                <Path
                  key={`path-${i}`}
                  d={stroke.join("")} // convert array → string
                  stroke="blue"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}

              {currentPath.length > 0 && (
                <Path
                  d={currentPath.join("")}
                  stroke="black"
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </Svg>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 180,
    height: 180,
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
