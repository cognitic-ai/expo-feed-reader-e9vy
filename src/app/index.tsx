import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import * as AC from "@bacons/apple-colors";
import Stack from "expo-router/stack";
import { FeedItem, fetchFeed } from "@/lib/rss";
import FeedCardFeatured from "@/components/feed-card-featured";
import FeedCard from "@/components/feed-card";

export default function FeedScreen() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchFeed();
      setItems(data);
    } catch (e: any) {
      setError(e.message || "Failed to load feed");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFeed();
  }, [loadFeed]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
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
          selectable
          style={{
            fontSize: 16,
            color: AC.secondaryLabel as any,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      </View>
    );
  }

  const [featured, ...rest] = items;

  return (
    <>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          padding: 16,
          gap: 16,
          paddingBottom: 32,
        }}
      >
        {featured && <FeedCardFeatured item={featured} />}

        {rest.length > 0 && (
          <View style={{ gap: 6, marginTop: 4 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: AC.label as any,
                letterSpacing: -0.3,
                paddingHorizontal: 4,
              }}
            >
              Recent Updates
            </Text>
          </View>
        )}

        {rest.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </ScrollView>

      <FeedToolbar />
    </>
  );
}

function FeedToolbar() {
  if (process.env.EXPO_OS !== "ios") return null;

  return (
    <Stack.Toolbar placement="right">
      <Stack.Toolbar.Menu icon="ellipsis">
        <Stack.Toolbar.Menu inline title="Feed">
          <Stack.Toolbar.MenuAction icon="newspaper" isOn>
            Expo Changelog
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.MenuAction icon="arrow.clockwise">
          Refresh
        </Stack.Toolbar.MenuAction>
      </Stack.Toolbar.Menu>
    </Stack.Toolbar>
  );
}
