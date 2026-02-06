import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import * as AC from "@bacons/apple-colors";
import { FeedItem, formatDate } from "@/lib/rss";

export default function FeedCard({ item }: { item: FeedItem }) {
  const hasImage = !!item.thumbnail;

  return (
    <Link href={`/article/${encodeURIComponent(item.id)}`} asChild>
      <Link.Trigger withAppleZoom>
        <Pressable
          style={({ pressed }) => ({
            opacity: pressed ? 0.9 : 1,
            borderRadius: 16,
            borderCurve: "continuous",
            overflow: "hidden",
            backgroundColor: AC.secondarySystemGroupedBackground as any,
          })}
        >
          {hasImage && (
            <Link.AppleZoom>
              <Image
                source={{ uri: item.thumbnail! + "?w=800&h=450" }}
                style={{
                  width: "100%",
                  aspectRatio: 16 / 9,
                }}
                contentFit="cover"
                transition={200}
              />
            </Link.AppleZoom>
          )}

          <View style={{ padding: 14, gap: 6 }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: AC.label as any,
                lineHeight: 22,
              }}
            >
              {item.title}
            </Text>

            <Text
              numberOfLines={2}
              style={{
                fontSize: 14,
                color: AC.secondaryLabel as any,
                lineHeight: 20,
              }}
            >
              {item.description}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 2,
              }}
            >
              <Image
                source="sf:newspaper.fill"
                style={{
                  width: 12,
                  height: 12,
                  tintColor: AC.systemBlue as any,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: AC.systemBlue as any,
                }}
              >
                Expo
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: AC.tertiaryLabel as any,
                }}
              >
                {" · "}
                {formatDate(item.pubDate)}
              </Text>
              {item.authors.length > 0 && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 12,
                    color: AC.tertiaryLabel as any,
                    flex: 1,
                  }}
                >
                  {" · "}
                  {item.authors[0]}
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
