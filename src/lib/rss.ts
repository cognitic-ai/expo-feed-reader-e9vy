export interface FeedItem {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  authors: string[];
  thumbnail: string | null;
}

function extractItems(xml: string): FeedItem[] {
  const items: FeedItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title = extractCDATA(block, "title") || extractTag(block, "title");
    const link = extractTag(block, "link");
    const guid = extractTag(block, "guid");
    const pubDate = extractTag(block, "pubDate");
    const description =
      extractCDATA(block, "description") || extractTag(block, "description");

    // Extract all authors
    const authors: string[] = [];
    const authorRegex = /<author>([\s\S]*?)<\/author>/g;
    let authorMatch: RegExpExecArray | null;
    while ((authorMatch = authorRegex.exec(block)) !== null) {
      authors.push(authorMatch[1].trim());
    }

    // Extract media:thumbnail
    const thumbMatch = block.match(
      /<media:thumbnail\s+url="([^"]+)"\s*\/?>/
    );
    const thumbnail = thumbMatch ? thumbMatch[1] : null;

    items.push({
      id: guid || link,
      title,
      link,
      description,
      pubDate,
      authors,
      thumbnail,
    });
  }

  return items;
}

function extractTag(block: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const match = block.match(regex);
  return match ? match[1].trim() : "";
}

function extractCDATA(block: string, tag: string): string {
  const regex = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`
  );
  const match = block.match(regex);
  return match ? match[1].trim() : "";
}

const RSS_URL = "https://expo.dev/changelog/rss.xml";

export async function fetchFeed(): Promise<FeedItem[]> {
  let xml: string;

  if (process.env.EXPO_OS === "web") {
    // On web, use a CORS proxy since the RSS feed doesn't serve CORS headers
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`);
    }
    xml = await response.text();
  } else {
    const response = await fetch(RSS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`);
    }
    xml = await response.text();
  }

  return extractItems(xml);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
