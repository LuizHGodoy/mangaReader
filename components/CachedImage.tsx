import { Image, type ImageStyle } from "expo-image";
import { StyleSheet } from "react-native";

const cacheConfig = {
  ttl: 24 * 60 * 60 * 1000,
};

interface CachedImageProps {
  uri: string;
  style?: ImageStyle | ImageStyle[];
  contentFit?: "cover" | "contain";
  onLoadEnd?: () => void;
}

export function CachedImage({
  uri,
  style,
  contentFit = "cover",
  onLoadEnd,
}: CachedImageProps) {
  return (
    <Image
      source={uri}
      style={[styles.image, style]}
      contentFit={contentFit}
      transition={200}
      cachePolicy="disk"
      onLoadEnd={onLoadEnd}
      {...cacheConfig}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});
