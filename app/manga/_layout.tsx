import Colors from "@/constants/Colors";
import { themeAtom } from "@/store/theme";
import { Stack } from "expo-router";
import { useAtomValue } from "jotai";

export default function MangaLayout() {
  const theme = useAtomValue(themeAtom);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors[theme].background,
        },
        headerTintColor: Colors[theme].text,
        headerBackTitle: "Voltar",
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          title: "Detalhes do Mangá",
          headerBackTitleVisible: false,
        }}
      />
    </Stack>
  );
}
