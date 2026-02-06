import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import Stack from "expo-router/stack";
import * as AC from "@bacons/apple-colors";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import { FeedItem, fetchFeed, formatFullDate } from "@/lib/rss";

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<FeedItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed()
      .then((items) => {
        const found = items.find((i) => i.id === decodeURIComponent(id));
        setItem(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const openInBrowser = useCallback(async () => {
    if (!item) return;
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await WebBrowser.openBrowserAsync(item.link);
  }, [item]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!item) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            color: AC.secondaryLabel as any,
            textAlign: "center",
          }}
        >
          Article not found
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: 64 }}
      >
        {item.thumbnail && (
          <Link.AppleZoomTarget>
            <Image
              source={{ uri: item.thumbnail + "?w=1200&h=675" }}
              style={{
                width: "100%",
                aspectRatio: 16 / 9,
              }}
              contentFit="cover"
              transition={300}
            />
          </Link.AppleZoomTarget>
        )}

        <View style={{ padding: 20, gap: 16 }}>
          {/* Source badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                borderCurve: "continuous",
                backgroundColor: AC.systemBlue as any,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source="sf:newspaper.fill"
                style={{
                  width: 16,
                  height: 16,
                  tintColor: "white",
                }}
              />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: AC.label as any,
                }}
              >
                Expo Changelog
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: AC.secondaryLabel as any,
                }}
              >
                {formatFullDate(item.pubDate)}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text
            selectable
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: AC.label as any,
              lineHeight: 34,
              letterSpacing: -0.5,
            }}
          >
            {item.title}
          </Text>

          {/* Authors */}
          {item.authors.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: AC.secondaryLabel as any,
                }}
              >
                By
              </Text>
              {item.authors.map((author, i) => (
                <View
                  key={author}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: AC.systemGray5 as any,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source="sf:person.fill"
                      style={{
                        width: 12,
                        height: 12,
                        tintColor: AC.secondaryLabel as any,
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: AC.label as any,
                    }}
                  >
                    {author}
                    {i < item.authors.length - 1 ? "," : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Separator */}
          <View
            style={{
              height: 0.5,
              backgroundColor: AC.separator as any,
            }}
          />

          {/* Description */}
          <Text
            selectable
            style={{
              fontSize: 17,
              color: AC.label as any,
              lineHeight: 26,
            }}
          >
            {item.description}
          </Text>

          {/* Read more button */}
          <Pressable
            onPress={openInBrowser}
            style={({ pressed }) => ({
              backgroundColor: AC.systemBlue as any,
              paddingVertical: 14,
              paddingHorizontal: 24,
              borderRadius: 14,
              borderCurve: "continuous",
              alignItems: "center",
              opacity: pressed ? 0.85 : 1,
              marginTop: 8,
            })}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
                color: "white",
              }}
            >
              Read Full Article
            </Text>
          </Pressable>

          {/* Link text */}
          <Text
            selectable
            style={{
              fontSize: 13,
              color: AC.tertiaryLabel as any,
              textAlign: "center",
            }}
          >
            {item.link}
          </Text>
        </View>
      </ScrollView>

      <Stack.Screen options={{ title: "" }} />
      <ArticleToolbar item={item} onOpenBrowser={openInBrowser} />
    </>
  );
}

function ArticleToolbar({
  item,
  onOpenBrowser,
}: {
  item: FeedItem;
  onOpenBrowser: () => void;
}) {
  if (process.env.EXPO_OS !== "ios") return null;

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button icon="safari" onPress={onOpenBrowser} />
        <Stack.Toolbar.Menu icon="ellipsis">
          <Stack.Toolbar.MenuAction
            icon="safari"
            onPress={onOpenBrowser}
          >
            Open in Safari
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon="doc.on.doc">
            Copy Link
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon="square.and.arrow.up">
            Share
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon="textformat.size">
            Text Size
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
      </Stack.Toolbar>

      <Stack.Toolbar placement="bottom">
        <Stack.Toolbar.Button icon="hand.thumbsup" onPress={() => {}} />
        <Stack.Toolbar.Button icon="hand.thumbsdown" onPress={() => {}} />
        <Stack.Toolbar.Spacer />
        <Stack.Toolbar.Button
          icon="square.and.arrow.up"
          onPress={() => {}}
          separateBackground
        />
      </Stack.Toolbar>
    </>
  );
}
