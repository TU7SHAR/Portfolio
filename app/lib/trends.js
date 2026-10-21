// Collects trending keywords from public, key-less sources:
//  • Google Trends daily RSS (US + India) — "famous things" people search for
//  • Hacker News top stories            — tech
//  • DEV.to top articles (past week)    — dev / tech
// Each source is fetched independently; one failing never breaks the others.

const UA = "Mozilla/5.0 (compatible; TusharPortfolioBot/1.0; +https://tushargautam.software)";

async function fetchWithTimeout(url, { timeout = 8000, ...init } = {}) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeout);
  try {
    return await fetch(url, {
      ...init,
      signal: ctrl.signal,
      headers: { "user-agent": UA, ...(init.headers || {}) },
      cache: "no-store",
    });
  } finally {
    clearTimeout(id);
  }
}

const decode = (s = "") =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .trim();

const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
};

const trafficToNumber = (t = "") => parseInt(t.replace(/[^\d]/g, ""), 10) || 0;

async function googleTrends(geo) {
  const res = await fetchWithTimeout(`https://trends.google.com/trending/rss?geo=${geo}`);
  if (!res.ok) throw new Error(`Google Trends ${geo}: HTTP ${res.status}`);
  const xml = await res.text();
  const items = xml.split("<item>").slice(1);
  return items.map((item) => {
    const news = item
      .split("<ht:news_item>")
      .slice(1)
      .map((n) => ({ title: tag(n, "ht:news_item_title"), url: tag(n, "ht:news_item_url") }))
      .filter((n) => n.title && /^https?:\/\//.test(n.url));
    const traffic = tag(item, "ht:approx_traffic");
    return {
      keyword: tag(item, "title"),
      source: `Google Trends (${geo})`,
      score: trafficToNumber(traffic),
      context: news.map((n) => n.title),
      links: news,
    };
  });
}

async function hackerNews(limit = 20) {
  const res = await fetchWithTimeout("https://hacker-news.firebaseio.com/v0/topstories.json");
  if (!res.ok) throw new Error(`Hacker News: HTTP ${res.status}`);
  const ids = (await res.json()).slice(0, limit);
  const stories = await Promise.all(
    ids.map((id) =>
      fetchWithTimeout(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { timeout: 5000 })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null)
    )
  );
  return stories
    .filter((s) => s && s.title && s.type === "story")
    .map((s) => ({
      keyword: s.title,
      source: "Hacker News",
      score: s.score || 0,
      context: [s.title],
      links: [{ title: s.title, url: s.url || `https://news.ycombinator.com/item?id=${s.id}` }],
    }));
}

async function devTo(limit = 15) {
  const res = await fetchWithTimeout(`https://dev.to/api/articles?top=7&per_page=${limit}`);
  if (!res.ok) throw new Error(`DEV.to: HTTP ${res.status}`);
  const posts = await res.json();
  return posts.map((p) => ({
    keyword: p.title,
    source: "DEV.to",
    score: p.public_reactions_count || 0,
    context: [p.description, ...(p.tag_list || []).map((t) => `#${t}`)].filter(Boolean),
    links: [{ title: p.title, url: p.url }],
  }));
}

export const normalizeTopic = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Returns `{ candidates, errors }`. Candidates are de-duplicated. */
export async function collectTrendingTopics() {
  const sources = [
    ["Google Trends (US)", () => googleTrends("US")],
    ["Google Trends (IN)", () => googleTrends("IN")],
    ["Hacker News", () => hackerNews()],
    ["DEV.to", () => devTo()],
  ];

  const results = await Promise.allSettled(sources.map(([, fn]) => fn()));
  const errors = [];
  const seen = new Set();
  const candidates = [];

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      errors.push(`${sources[i][0]}: ${r.reason?.message || r.reason}`);
      return;
    }
    for (const c of r.value) {
      const key = normalizeTopic(c.keyword);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      candidates.push({ ...c, key });
    }
  });

  return { candidates, errors };
}
