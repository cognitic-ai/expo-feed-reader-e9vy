import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import * as AC from "@bacons/apple-colors";
import { FeedItem, formatDate } from "@/lib/rss";

export default function FeedCardFeatured({ item }: { item: FeedItem }) {
  return (
    <Link href={`/article/${encodeURIComponent(item.id)}`} asChild>
      <Link.Trigger withAppleZoom>
        <Pressable
          style={({ pressed }) => ({
            opacity: pressed ? 0.9 : 1,
            borderRadius: 20,
            borderCurve: "continuous",
            overflow: "hidden",
            backgroundColor: AC.secondarySystemGroupedBackground as any,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          })}
        >
          {item.thumbnail && (
            <Link.AppleZoom>
              <Image
                source={{ uri: item.thumbnail + "?w=1200&h=675" }}
                style={{
                  width: "100%",
                  aspectRatio: 16 / 9,
                }}
                contentFit="cover"
                transition={300}
              />
            </Link.AppleZoom>
          )}

          <View style={{ padding: 16, gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Image
                source="sf:newspaper.fill"
                style={{
                  width: 14,
                  height: 14,
                  tintColor: AC.systemBlue as any,
                }}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: AC.systemBlue as any,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Expo Changelog
              </Text>
            </View>

            <Text
              numberOfLines={3}
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: AC.label as any,
                lineHeight: 28,
                letterSpacing: -0.3,
              }}
            >
              {item.title}
            </Text>

            <Text
              numberOfLines={3}
              style={{
                fontSize: 15,
                color: AC.secondaryLabel as any,
                lineHeight: 21,
              }}
            >
              {item.description}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: AC.tertiaryLabel as any,
                }}
              >
                {formatDate(item.pubDate)}
              </Text>
              {item.authors.length > 0 && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 13,
                    color: AC.tertiaryLabel as any,
                    flex: 1,
                  }}
                >
                  {" · "}
                  {item.authors.join(", ")}
                </Text>
              )}
            </View>
          </View>
        </Pressable>
      </Link.Trigger>

      <Link.Menu>
        <Link.MenuAction
          title="Open in Browser"
          icon="safari"
          onPress={() => {}}
        />
        <Link.MenuAction
          title="Copy Link"
          icon="doc.on.doc"
          onPress={() => {}}
        />
        <Link.MenuAction
          title="Share"
          icon="square.and.arrow.up"
          onPress={() => {}}
        />
      </Link.Menu>

      <Link.Preview />
    </Link>
  );
}
