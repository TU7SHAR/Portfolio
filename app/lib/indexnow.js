import site from "../utils/siteMetaData.js";

// IndexNow tells Bing (and Yandex, Naver, Seznam, Yep) about new or changed
// URLs right away instead of waiting for a crawl. Bing's index also feeds
// Microsoft Copilot and other AI search tools. Google does not use IndexNow;
// for Google, the sitemap + Search Console are what count.
//
// Setup: set INDEXNOW_KEY to 8-128 letters/digits/dashes (e.g. `openssl rand -hex 16`).
// The key is served at /indexnow-key.txt (app/indexnow-key.txt/route.js).

export const indexNowKey = () => {
  const key = process.env.INDEXNOW_KEY || "";
  return /^[a-zA-Z0-9-]{8,128}$/.test(key) ? key : null;
};

/** @param {string[]} paths site paths like "/blog/my-post" (or absolute URLs on this host) */
export async function submitToIndexNow(paths) {
  const key = indexNowKey();
  if (!key) return { ok: false, skipped: "INDEXNOW_KEY not set" };
  const host = new URL(site.siteUrl).host;
  const urlList = [...new Set(paths.map((p) => new URL(p, site.siteUrl).toString()))].slice(0, 10000);
  if (!urlList.length) return { ok: false, skipped: "no URLs" };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation: `${site.siteUrl}/indexnow-key.txt`, urlList }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  // 200 = accepted, 202 = accepted, key validation pending
  return { ok: res.status === 200 || res.status === 202, status: res.status, submitted: urlList.length };
}
