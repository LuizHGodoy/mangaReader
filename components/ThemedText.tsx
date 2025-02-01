import Colors from "@/constants/Colors";
import { themeAtom } from "@/store/theme";
import { useAtomValue } from "jotai";
import React from "react";
import { Text, type TextProps } from "react-native";

interface ThemedTextProps extends TextProps {
  type?: "title" | "body";
}

export function ThemedText({ type = "body", ...props }: ThemedTextProps) {
  const theme = useAtomValue(themeAtom);
  return (
    <Text
      {...props}
      style={[
        {
          color: Colors[theme].text,
          fontSize: type === "title" ? 24 : 16,
          fontWeight: type === "title" ? "bold" : "normal",
        },
        props.style,
      ]}
    />
  );
}
