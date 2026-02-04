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
const { height, width } = Dimensions.get("window");
const imageSource = require("../assets/images/exampleStroke.png");
// THIS PAGE NEEDS STROKE ORDER IMAGE.

export default function CanvasPage() {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isClearButtonClicked, setClearButtonClicked] = useState(false);

  const onTouchEnd = () => {
    setPaths((prev) => [...prev, currentPath]);
    setCurrentPath([]);
    setClearButtonClicked(false);
  };

  const onTouchMove = (event) => {
    const newPath = [...currentPath];
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${newPath.length === 0 ? "M" : ""}${locationX.toFixed(0)},${locationY.toFixed(0)} `;
    newPath.push(newPoint);
    setCurrentPath(newPath);
  };

  const handleClearButtonClick = () => {
    setPaths([]);
    setCurrentPath([]);
    setClearButtonClicked(true);
  };

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
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <ImageBackground
              style={styles.backgroundImage}
              source={imageSource}
            >
              <Svg height={height * 0.7} width={width}>
                <Path
                  d={paths.join("")}
                  stroke={isClearButtonClicked ? "transparent" : "blue"}
                  fill={"transparent"}
                  strokeWidth={15}
                  strokeLinejoin={"round"}
                  strokeLinecap={"round"}
                />
                {paths.length > 0 &&
                  paths.map((item, index) => (
                    <Path
                      key={`path-${index}`}
                      d={currentPath.join("")}
                      stroke={isClearButtonClicked ? "transparent" : "black"}
                      fill={"transparent"}
                      strokeWidth={15}
                      strokeLinejoin={"round"}
                      strokeLinecap={"round"}
                    />
                  ))}
              </Svg>
            </ImageBackground>
          </View>
          <MyButton onPress={handleClearButtonClick} title={"Clear"}></MyButton>
        </View>
      }
    ></HalfSplashTemplate>
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
    borderWidth: 1,
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
