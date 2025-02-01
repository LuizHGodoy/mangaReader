import Colors from "@/constants/Colors";
import { type Language, languageAtom } from "@/store/settings";
import { themeAtom } from "@/store/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
} from "react-native";

import { authAtom, clearAuthData } from "@/store/auth";
import React from "react";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const languages: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "pt-br", label: "Português" },
  { value: "ja", label: "日本語" },
];

export function Settings() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [theme, setTheme] = useAtom(themeAtom);
  const [language, setLanguage] = useAtom(languageAtom);
  const [, setAuth] = useAtom(authAtom);
  const router = useRouter();

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await clearAuthData();
            setAuth(null);
            setIsModalVisible(false);
            router.replace("/login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons
          name="settings-outline"
          size={24}
          color={Colors[theme].text}
        />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: Colors[theme].background },
            ]}
          >
            <ThemedText type="title" style={styles.modalTitle}>
              Configurações
            </ThemedText>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Tema</ThemedText>
              <TouchableOpacity style={styles.option} onPress={toggleTheme}>
                <ThemedText>
                  {theme === "light" ? "Tema Claro" : "Tema Escuro"}
                </ThemedText>
                <Ionicons
                  name={theme === "light" ? "sunny" : "moon"}
                  size={24}
                  color={Colors[theme].text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Idioma</ThemedText>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  style={[
                    styles.option,
                    language === lang.value &&
                      (styles.selectedOption as ViewStyle),
                  ]}
                  onPress={() => setLanguage(lang.value)}
                >
                  <ThemedText>{lang.label}</ThemedText>
                  {language === lang.value && (
                    <Ionicons
                      name="checkmark"
                      size={24}
                      color={Colors[theme].text}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <TouchableOpacity
                style={[
                  styles.logoutButton,
                  { borderColor: Colors[theme].border },
                ]}
                onPress={handleLogout}
              >
                <ThemedText style={styles.logoutText}>Sair da conta</ThemedText>
                <Ionicons
                  name="log-out-outline"
                  size={24}
                  color={Colors[theme].text}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <ThemedText>Fechar</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "rgba(128, 128, 128, 0.2)",
  },
  closeButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
  },
  logoutText: {
    color: "#ff4444",
  },
});
