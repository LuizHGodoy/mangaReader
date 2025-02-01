import { authAtom, loadAuthData } from "@/store/auth";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useAtom } from "jotai";
import { useEffect } from "react";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [auth, setAuth] = useAtom(authAtom);

  useEffect(() => {
    const init = async () => {
      try {
        const savedAuth = await loadAuthData();
        if (savedAuth) {
          setAuth(savedAuth);
        }
      } catch (e) {
        console.error("Erro ao carregar dados de autenticação:", e);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="manga" />
      <Stack.Screen name="reader" />
    </Stack>
  );
}
