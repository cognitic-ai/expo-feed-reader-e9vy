export async function GET() {
  const response = await fetch("https://expo.dev/changelog/rss.xml");
  const xml = await response.text();
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=300",
    },
  });
}
