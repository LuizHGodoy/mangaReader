import Colors from "@/constants/Colors";
import { mangadexApi } from "@/services/mangadex";
import { themeAtom } from "@/store/theme";
import { useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface Manga {
  id: string;
  type: string;
  attributes: {
    title: Record<string, string>;
    description: Record<string, string>;
  };
  relationships: Array<{
    id: string;
    type: string;
    attributes?: {
      fileName?: string;
    };
  }>;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const theme = useAtomValue(themeAtom);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await mangadexApi.searchManga(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCoverUrl = (manga: Manga) => {
    const coverRelationship = manga.relationships.find(
      (rel) => rel.type === "cover_art"
    );
    if (coverRelationship?.attributes?.fileName) {
      return mangadexApi.getCoverUrl(
        manga.id,
        coverRelationship.attributes.fileName
      );
    }
    return null;
  };

  return (
    <ThemedSafeAreaView>
      <ThemedView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              { color: Colors[theme].text, borderColor: Colors[theme].border },
            ]}
            placeholder="Buscar mangá..."
            placeholderTextColor={Colors[theme].tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors[theme].tint} />
          </View>
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.resultsList}
            renderItem={({ item }) => {
              const coverUrl = getCoverUrl(item);
              const title =
                item.attributes.title.en ||
                item.attributes.title.ja ||
                Object.values(item.attributes.title)[0];

              return (
                <TouchableOpacity
                  style={[
                    styles.mangaItem,
                    { backgroundColor: Colors[theme].card },
                  ]}
                  onPress={() => router.push(`/manga/${item.id}`)}
                >
                  {coverUrl && (
                    <Image
                      source={{ uri: coverUrl }}
                      style={styles.mangaCover}
                      resizeMode="cover"
                    />
                  )}
                  <View style={styles.mangaInfo}>
                    <ThemedText style={styles.mangaTitle}>{title}</ThemedText>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsList: {
    paddingVertical: 8,
  },
  mangaItem: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  mangaCover: {
    width: 100,
    height: 150,
  },
  mangaInfo: {
    flex: 1,
    padding: 12,
  },
  mangaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
});
