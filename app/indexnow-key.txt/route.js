import { indexNowKey } from "../lib/indexnow.js";

// Proves ownership of the domain to IndexNow (see app/lib/indexnow.js).
export const dynamic = "force-dynamic";

export function GET() {
  const key = indexNowKey();
  if (!key) return new Response("Not found", { status: 404 });
  return new Response(key, {
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=86400" },
  });
}
