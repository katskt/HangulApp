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
const imageSource = require("../../../../assets/images/exampleStroke.png");
import CanvasPage from "../../../../components/TraceCanvas";
// THIS PAGE NEEDS STROKE ORDER IMAGE.

export default function consonantPage() {
  return <CanvasPage></CanvasPage>;
}
