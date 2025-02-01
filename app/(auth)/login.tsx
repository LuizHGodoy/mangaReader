import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Colors from "@/constants/Colors";
import { mangadexApi } from "@/services/mangadex";
import { authAtom, saveAuthData } from "@/store/auth";
import { themeAtom } from "@/store/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const setAuth = useSetAtom(authAtom);
  const theme = useAtomValue(themeAtom);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Preencha todos os campos");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await mangadexApi.login(username, password);
      const userData = await mangadexApi.getCurrentUser(response.access_token);

      const authData = {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        user: {
          id: userData.data.id,
          username: userData.data.attributes.username,
        },
      };

      await saveAuthData(authData);
      setAuth(authData);
      router.replace("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setError("Usuário ou senha inválidos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.formContainer}>
        <ThemedText type="title" style={styles.title}>
          Login MangaDex
        </ThemedText>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Usuário</ThemedText>
          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: Colors[theme].border,
                backgroundColor: Colors[theme].card,
                borderWidth: 1,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  color: Colors[theme].text,
                },
              ]}
              placeholder="Admin"
              placeholderTextColor={Colors[theme].tabIconDefault}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setError(null);
              }}
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Senha</ThemedText>
          <View
            style={[
              styles.inputWrapper,
              {
                borderColor: Colors[theme].border,
                backgroundColor: Colors[theme].card,
                borderWidth: 1,
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                {
                  color: Colors[theme].text,
                },
              ]}
              placeholder="********"
              placeholderTextColor={Colors[theme].tabIconDefault}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError(null);
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={24}
                color={Colors[theme].text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: Colors[theme].card,
              borderColor: Colors[theme].border,
              borderWidth: 1,
            },
          ]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors[theme].text} />
          ) : (
            <View style={styles.buttonContent}>
              <ThemedText style={styles.buttonText}>Entrar</ThemedText>
              <Ionicons
                name="log-in-outline"
                size={24}
                color={Colors[theme].text}
              />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputWrapper: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "500",
    opacity: 0.8,
  },
  input: {
    fontSize: 16,
    height: "100%",
    flex: 1,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    padding: 16,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  errorText: {
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 10,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
});
