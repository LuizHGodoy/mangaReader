import { CachedImage } from "@/components/CachedImage";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Colors from "@/constants/Colors";
import { mangadexApi } from "@/services/mangadex";
import { themeAtom } from "@/store/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  type ImageStyle,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

interface Page {
  id: string;
  url: string;
  chapter: {
    hash: string;
    data: string[];
    dataSaver: string[];
  };
}

interface ChapterInfo {
  id: string;
  attributes: {
    chapter: string;
    title: string | null;
  };
}

export default function ReaderScreen() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [nextChapter, setNextChapter] = useState<ChapterInfo | null>(null);
  const theme = useAtomValue(themeAtom);
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pagesResponse, nextChapterResponse] = await Promise.all([
          mangadexApi.getChapterPages(id),
          mangadexApi.getNextChapter(id),
        ]);
        setPages(pagesResponse);
        setNextChapter(nextChapterResponse);
      } catch (error) {
        console.error("Erro ao carregar páginas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePagePress = (x: number) => {
    const screenThird = width / 3;

    if (x < screenThird) {
      if (currentPage > 0) {
        setIsPageLoading(true);
        setCurrentPage(currentPage - 1);
      }
    } else if (x > screenThird * 2) {
      if (currentPage < pages.length - 1) {
        setIsPageLoading(true);
        setCurrentPage(currentPage + 1);
      }
    } else {
      setShowControls(!showControls);
    }
  };

  const handleImageLoad = () => {
    setIsPageLoading(false);
  };

  const progress =
    pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0;
  const isLastPage = currentPage === pages.length - 1;

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.pageContainer}
        onPress={(e) => handlePagePress(e.nativeEvent.locationX)}
      >
        {pages[currentPage] && (
          <CachedImage
            uri={pages[currentPage].url}
            style={[styles.page, { width, height }] as ImageStyle[]}
            contentFit="contain"
            onLoadEnd={handleImageLoad}
          />
        )}

        {isPageLoading && (
          <View style={styles.pageLoadingContainer}>
            <ActivityIndicator size="large" color={Colors[theme].tint} />
          </View>
        )}

        {showControls && (
          <View style={styles.controls}>
            <View style={styles.header}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress}%`,
                      backgroundColor: Colors[theme].tint,
                    },
                  ]}
                />
              </View>
              <ThemedText style={styles.pageInfo}>
                {currentPage + 1} / {pages.length}
              </ThemedText>
            </View>

            {isLastPage && nextChapter && (
              <TouchableOpacity
                style={[
                  styles.nextChapterButton,
                  {
                    backgroundColor: Colors[theme].card,
                    borderColor: Colors[theme].border,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => router.replace(`/reader/${nextChapter.id}`)}
              >
                <ThemedText style={styles.nextChapterText}>
                  Próximo Capítulo
                </ThemedText>
                <Ionicons
                  name="arrow-forward"
                  size={24}
                  color={Colors[theme].text}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.touchAreas}>
          <View style={styles.touchArea} />
          <View style={styles.touchArea} />
          <View style={styles.touchArea} />
        </View>
      </TouchableOpacity>
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
  pageContainer: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  pageInfo: {
    color: "#fff",
    textAlign: "center",
  },
  touchAreas: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  touchArea: {
    flex: 1,
  },
  nextChapterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  nextChapterText: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  pageLoadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});
