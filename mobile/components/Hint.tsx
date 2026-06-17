import { FontSizes } from "@/theme/typography";
import { useResponsive } from "@/utils/responsive";
import { Text, View } from "react-native";
export default function Hint({ children }: { children: React.ReactNode }) {
  const { wp } = useResponsive();
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          color: "white",
          backgroundColor: "black",
          padding: wp(2),
          opacity: 0.9,
          borderRadius: 10,
          fontSize: FontSizes.header,
        }}
      >
        {children}
      </Text>
    </View>
  );
}
