import { Dimensions, PixelRatio } from "react-native";

const { height } = Dimensions.get("window");

// base height
const scale = height / 800;

const normalize = (size: number) => {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

export const FontSizes = {
  header: normalize(25),
  h2: normalize(20),
  h3: normalize(18),
  body: normalize(16),
  caption: normalize(13),
  huge: normalize(50),
  hugeXL: normalize(80),
  character: normalize(110),
};

export const Typography = {
  default: "Jua",
  english: "AsapCondensedSemiBold",
};
export const FontWeights = {
  regular: 400 as const,
  medium: 500 as const,
  semibold: 600 as const,
  bold: 700 as const,
};
// ocr
