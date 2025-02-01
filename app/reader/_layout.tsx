import Colors from "@/constants/Colors";
import { themeAtom } from "@/store/theme";
import { Stack } from "expo-router";
import { useAtomValue } from "jotai";

export default function ReaderLayout() {
  const theme = useAtomValue(themeAtom);

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[theme].background,
        },
        headerTintColor: Colors[theme].text,
        headerTitle: "Leitor",
        headerBackTitle: "Voltar",
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
