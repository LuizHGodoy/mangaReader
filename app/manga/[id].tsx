import { CachedImage } from "@/components/CachedImage";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Colors from "@/constants/Colors";
import { mangadexApi } from "@/services/mangadex";
import { chapterOrderAtom, languageAtom } from "@/store/settings";
import { themeAtom } from "@/store/theme";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface MangaDetails {
  id: string;
  type: string;
  attributes: {
    title: Record<string, string>;
    description: Record<string, string>;
    status: string;
    year: number | null;
    contentRating: string;
  };
  relationships: Array<{
    id: string;
    type: string;
    attributes?: {
      fileName?: string;
    };
  }>;
}

interface Chapter {
  id: string;
  attributes: {
    volume: string | null;
    chapter: string | null;
    title: string | null;
    translatedLanguage: string;
    publishAt: string;
  };
  relationships: Array<{
    id: string;
    type: string;
    attributes?: {
      name?: string;
    };
  }>;
}

export default function MangaScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const [manga, setManga] = useState<MangaDetails | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useAtomValue(themeAtom);
  const language = useAtomValue(languageAtom);
  const [chapterOrder, setChapterOrder] = useAtom(chapterOrderAtom);
  const navigation = useNavigation();
  const router = useRouter();
  const [isOrdering, setIsOrdering] = useState(false);

  const sortedChapters = useMemo(() => {
    return [...chapters].sort((a, b) => {
      const chapterA = Number(a.attributes.chapter) || 0;
      const chapterB = Number(b.attributes.chapter) || 0;
      return chapterOrder === "asc" ? chapterA - chapterB : chapterB - chapterA;
    });
  }, [chapters, chapterOrder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mangaResponse, chaptersResponse] = await Promise.all([
          mangadexApi.getMangaDetails([id]),
          mangadexApi.getChapters(id, language),
        ]);

        setManga(mangaResponse.data[0]);
        setChapters(chaptersResponse.data);

        if (mangaResponse.data[0]) {
          const title =
            mangaResponse.data[0].attributes.title[language] ||
            mangaResponse.data[0].attributes.title.en ||
            Object.values(mangaResponse.data[0].attributes.title)[0];
          navigation.setOptions({
            title,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, language]);

  const getCoverUrl = (manga: MangaDetails) => {
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

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
      </ThemedView>
    );
  }

  if (!manga) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Mangá não encontrado</ThemedText>
      </ThemedView>
    );
  }

  const title =
    manga.attributes.title.en ||
    manga.attributes.title.ja ||
    Object.values(manga.attributes.title)[0];

  const description =
    manga.attributes.description.en ||
    manga.attributes.description.pt ||
    Object.values(manga.attributes.description)[0];

  const coverUrl = getCoverUrl(manga);

  const renderChapter = ({ item }: { item: Chapter }) => {
    const group = item.relationships.find(
      (rel) => rel.type === "scanlation_group"
    );
    const groupName = group?.attributes?.name || "Desconhecido";
    const chapterNumber = item.attributes.chapter || "?";
    const chapterTitle = item.attributes.title || `Capítulo ${chapterNumber}`;
    const publishDate = format(
      new Date(item.attributes.publishAt),
      "dd/MM/yyyy",
      { locale: ptBR }
    );

    return (
      <TouchableOpacity
        style={[styles.chapterItem, { borderColor: Colors[theme].border }]}
        onPress={() => router.push(`/reader/${item.id}`)}
      >
        <View>
          <ThemedText style={styles.chapterTitle}>
            Cap. {chapterNumber} - {chapterTitle}
          </ThemedText>
          <ThemedText style={styles.chapterInfo}>
            {groupName} • {publishDate}
          </ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors[theme].text} />
      </TouchableOpacity>
    );
  };

  const toggleOrder = async () => {
    setIsOrdering(true);
    setTimeout(() => {
      setChapterOrder((current) => (current === "asc" ? "desc" : "asc"));
      setIsOrdering(false);
    }, 0);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          {coverUrl && (
            <CachedImage
              uri={coverUrl}
              style={styles.cover}
              contentFit="cover"
            />
          )}
          <View style={styles.titleContainer}>
            <ThemedText type="title" style={styles.title}>
              {title}
            </ThemedText>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Status:</ThemedText>
            <ThemedText>{manga.attributes.status}</ThemedText>
          </View>
          {manga.attributes.year && (
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Ano:</ThemedText>
              <ThemedText>{manga.attributes.year}</ThemedText>
            </View>
          )}
          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Classificação:</ThemedText>
            <ThemedText>{manga.attributes.contentRating}</ThemedText>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <ThemedText type="title" style={styles.sectionTitle}>
            Descrição
          </ThemedText>
          <ThemedText style={styles.description}>{description}</ThemedText>
        </View>

        <View style={styles.chaptersContainer}>
          <View style={styles.chaptersHeader}>
            <ThemedText type="title" style={styles.sectionTitle}>
              Capítulos
            </ThemedText>
            <TouchableOpacity
              style={[
                styles.orderButton,
                isOrdering && styles.orderButtonDisabled,
              ]}
              onPress={toggleOrder}
              disabled={isOrdering}
            >
              {isOrdering ? (
                <ActivityIndicator size="small" color={Colors[theme].text} />
              ) : (
                <Ionicons
                  name={chapterOrder === "asc" ? "arrow-up" : "arrow-down"}
                  size={24}
                  color={Colors[theme].text}
                />
              )}
            </TouchableOpacity>
          </View>

          <FlashList
            data={sortedChapters}
            renderItem={renderChapter}
            estimatedItemSize={72}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </ThemedView>
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
    alignItems: "center",
    padding: 16,
  },
  cover: {
    width: 240,
    height: 360,
    borderRadius: 12,
  },
  titleContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
  },
  infoContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(128, 128, 128, 0.2)",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  descriptionContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  description: {
    lineHeight: 24,
  },
  chaptersContainer: {
    padding: 16,
  },
  chapterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  chapterTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  chapterInfo: {
    fontSize: 14,
    opacity: 0.7,
  },
  chaptersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  orderButton: {
    padding: 8,
  },
  orderButtonDisabled: {
    opacity: 0.5,
  },
});
