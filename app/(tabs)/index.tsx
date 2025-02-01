import { mangadexApi } from "@/services/mangadex";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { Settings } from "@/components/Settings";
import { useTheme } from "@/components/ThemeProvider";
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

export default function HomeScreen() {
  const [selfPublishedMangas, setSelfPublishedMangas] = useState<Manga[]>([]);
  const [seasonalMangas, setSeasonalMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        setError(null);
        const [selfPublishedList, seasonalList] = await Promise.all([
          mangadexApi.getSelfPublishedList(),
          mangadexApi.getSeasonalList(),
        ]);

        const selfPublishedIds = selfPublishedList.data.relationships
          .filter((rel: any) => rel.type === "manga")
          .map((rel: any) => rel.id);

        const seasonalIds = seasonalList.data.relationships
          .filter((rel: any) => rel.type === "manga")
          .map((rel: any) => rel.id);

        const [selfPublishedDetails, seasonalDetails] = await Promise.all([
          mangadexApi.getMangaDetails(selfPublishedIds),
          mangadexApi.getMangaDetails(seasonalIds),
        ]);

        setSelfPublishedMangas(selfPublishedDetails.data);
        setSeasonalMangas(seasonalDetails.data);
      } catch (err) {
        console.error("Erro ao carregar mangás:", err);
        setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMangas();
  }, []);

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

  const renderMangaItem = ({ item }: { item: Manga }) => {
    const coverUrl = getCoverUrl(item);
    const title =
      item.attributes.title.en ||
      item.attributes.title.ja ||
      Object.values(item.attributes.title)[0];

    return (
      <TouchableOpacity
        style={styles.mangaItem}
        onPress={() => router.push(`/manga/${item.id}`)}
      >
        {coverUrl && (
          <Image
            source={{ uri: coverUrl }}
            style={styles.mangaCover}
            resizeMode="cover"
          />
        )}
        <ThemedText style={styles.mangaTitle} numberOfLines={2}>
          {title}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, data: Manga[]) => (
    <View style={styles.section}>
      <ThemedText type="title" style={styles.sectionTitle}>
        {title}
      </ThemedText>
      <FlatList
        data={data}
        renderItem={renderMangaItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mangaList}
      />
    </View>
  );

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedSafeAreaView>
      <ThemedView style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <ThemedText type="title" style={styles.welcomeTitle}>
                  Bem vindo ao vuc mangás!
                </ThemedText>
                <Settings />
              </View>
            </View>
          }
          data={[
            {
              title: "Mangás Auto-Publicados",
              data: selfPublishedMangas,
            },
            {
              title: "Mangás da Temporada",
              data: seasonalMangas,
            },
          ]}
          renderItem={({ item }) => renderSection(item.title, item.data)}
          keyExtractor={(item) => item.title}
          showsVerticalScrollIndicator={false}
        />
      </ThemedView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 16,
    alignItems: "center",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginLeft: 16,
    marginBottom: 8,
  },
  mangaList: {
    paddingHorizontal: 8,
  },
  mangaItem: {
    width: 160,
    marginHorizontal: 8,
  },
  mangaCover: {
    width: "100%",
    height: 240,
    borderRadius: 8,
  },
  mangaTitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14,
  },
});
