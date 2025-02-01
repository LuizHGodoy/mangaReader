import Colors from "@/constants/Colors";
import { themeAtom } from "@/store/theme";
import { useAtomValue } from "jotai";
import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  type ViewProps,
} from "react-native";

export function ThemedSafeAreaView(props: ViewProps) {
  const theme = useAtomValue(themeAtom);
  return (
    <>
      <StatusBar
        backgroundColor={Colors[theme].background}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <SafeAreaView
        {...props}
        style={[
          {
            flex: 1,
            backgroundColor: Colors[theme].background,
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          },
          props.style,
        ]}
      />
    </>
  );
}
