import Colors from "@/constants/Colors";
import { themeAtom } from "@/store/theme";
import { useAtomValue } from "jotai";
import { View, type ViewProps } from "react-native";

export function ThemedView(props: ViewProps) {
  const theme = useAtomValue(themeAtom);
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: Colors[theme].background,
        },
        props.style,
      ]}
    />
  );
}
