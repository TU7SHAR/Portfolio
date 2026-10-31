const post = {
  slug: "nextjs-notfound-200-soft-404-fix",
  publishedAt: "2026-10-31T04:30:00.000Z",
  primaryQuery: "next.js notFound returns 200",
  title: "Why Next.js notFound() Returns 200, and How to Get a Real 404",
  metaTitle: "Next.js notFound() Returns 200? Fix Soft 404s in App Router",
  metaDescription:
    "notFound() returns 200 when the App Router has already started streaming. Here is why it happens, how I fixed it on my site, and how to test the status code.",
  excerpt:
    "The App Router sends the status code when streaming starts. If notFound() runs after that, you get the 404 page with a 200 status, and Search Console calls it a soft 404.",
  category: "Web Development",
  tags: ["Next.js", "SEO", "App Router"],
  keywords: [
    "next.js notfound 200",
    "next.js soft 404",
    "app router 404 status code",
    "notFound generateMetadata",
    "loading.js 404 status",
    "next.js streaming status code",
  ],
  tldr:
    "In the App Router, the HTTP status is sent the moment the response starts streaming. If `notFound()` runs after a `loading.js` fallback or a `<Suspense>` boundary has flushed, Next.js can only render the 404 UI with a 200 status plus a noindex tag. Call `notFound()` before anything streams, for example in `generateMetadata` or at the top of the page, and keep Suspense boundaries below that check.",
  keyTakeaways: [
    "The status code is fixed when the first byte streams. Anything that triggers streaming before your not-found check turns a 404 into a 200.",
    "`loading.js` wraps the page in a Suspense boundary, so a missing slug under a segment with `loading.js` streams first and returns 200.",
    "Next.js adds `<meta name=\"robots\" content=\"noindex\">` to streamed 404s, so the page stays out of the index, but Search Console still reports it as a soft 404.",
    "`notFound()` works by throwing. A `try/catch` around your data fetch will swallow it unless you rethrow.",
    "Test with `curl -w \"%{http_code}\"`, and on Next.js 15.2+ also with a bot user agent, because metadata streaming behaves differently for bots.",
  ],
  authorNote:
    "I hit this on this site's blog: missing post URLs rendered my 404 page but came back with a 200 status, which Google treats as a soft 404. The fixes below are the ones running in this site's code today.",
  sections: [
    {
      heading: "What is a soft 404, and why does Google care?",
      level: 2,
      paragraphs: [
        "A soft 404 is a URL that tells the browser everything is fine (HTTP 200) while the page itself says the content does not exist. Google detects these pages and lists them under \"Soft 404\" in the Search Console Pages report instead of treating them as normal pages.",
        "For a blog or any site with dynamic slugs, soft 404s waste crawl time on URLs that should be dropped, keep deleted posts lingering in reports, and confuse uptime checks and analytics that look at status codes. A real 404 (or 410 for permanently removed content) is the clear signal Google documents for missing pages.",
      ],
    },
    {
      heading: "Why does notFound() return a 200 status code?",
      level: 2,
      paragraphs: [
        "The App Router streams HTML. As soon as Next.js sends the first chunk, it also sends the response headers, and the status code is locked in. The Next.js docs on `loading.js` say it directly: streaming responses begin with a 200 status, and calling `notFound()` before the stream starts is what preserves the 404.",
        "So the question is never whether `notFound()` works. It always renders your `not-found.js` UI. The question is whether it ran before or after streaming began. When it runs after, Next.js streams the 404 UI and adds a noindex robots tag so the URL stays out of search results, but the status is still 200.",
      ],
      bullets: [
        "A `loading.js` file in the route segment, or in a parent segment, wraps the page in a Suspense boundary. The fallback flushes first, then your page calls `notFound()`: 200.",
        "A `<Suspense>` boundary in a layout above the page does the same thing for every route below it.",
        "On Next.js 15.2 and later, metadata can stream for regular browsers, so `generateMetadata` no longer always runs before the first byte. HTML-limited bots in Next.js's default list (including several Google crawlers, Bingbot and Twitterbot) still get blocking metadata.",
      ],
    },
    {
      heading: "How I fixed it on a Next.js 14 blog",
      level: 2,
      paragraphs: [
        "This site's blog posts live in MongoDB and are rendered by `app/blog/[slug]/page.jsx`. Three changes turned missing slugs into real 404s.",
        "First, call `notFound()` inside `generateMetadata`. In Next.js 14, metadata resolves before the response starts streaming, so a throw there still controls the status code. The page component checks again, which costs nothing because the lookup is wrapped in React's `cache()` and shared between the two.",
      ],
      code: {
        language: "jsx",
        content: `// app/blog/[slug]/page.jsx
import { notFound } from "next/navigation";
import { getPostBySlug } from "../../lib/posts.js"; // wrapped in React cache()

// render per request so an unknown slug can't be served from a cached 200
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound(); // runs before streaming -> real 404
  return { title: post.metaTitle, description: post.metaDescription };
}

export default async function BlogPost({ params }) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();
  return <article>{/* ... */}</article>;
}`,
      },
    },
    {
      heading: "Remove Suspense boundaries above the check",
      level: 3,
      paragraphs: [
        "Second, I had a `<Suspense>` wrapping `{children}` in the root layout. It made every dynamic page stream a 200 before the page could decide it was missing. Removing it fixed the status for every route at once. If you need loading UI, put the boundary inside the page, below the existence check, so the 404 decision happens first.",
        "Third, `dynamic = \"force-dynamic\"` on the post route. The post data is still cached with `unstable_cache` and a `posts` tag, so the database is not hit on every request, but the HTML render happens per request. That stops a missing slug from ever being cached as a static 200 page.",
      ],
      code: {
        language: "jsx",
        content: `// app/layout.js (before)
<div className="content-layer">
  <Suspense fallback={<Spinner />}>{children}</Suspense>
</div>

// app/layout.js (after): no root Suspense, so pages decide 404 before streaming
<div className="content-layer">{children}</div>`,
      },
    },
    {
      heading: "Which fix matches your setup?",
      level: 2,
      paragraphs: [
        "Find the row that matches what your route does today. Most apps need the first one plus whichever applies after it.",
      ],
      table: {
        headers: ["Cause", "What you see", "Fix"],
        rows: [
          ["Data check only inside the page, behind a Suspense boundary", "404 UI with status 200", "Check existence in generateMetadata or at the top of the page before any Suspense"],
          ["loading.js in the segment or a parent", "200 for every missing slug in that segment", "Remove loading.js there, or move the check into middleware"],
          ["Suspense around children in a layout", "200 for missing pages site-wide", "Move the boundary inside pages, below the check"],
          ["Known, finite list of slugs", "Unknown slugs render instead of 404", "generateStaticParams plus dynamicParams = false"],
          ["try/catch around the fetch that calls notFound()", "Error UI or empty page with 200", "Call notFound() outside the try block, or rethrow it"],
        ],
      },
    },
    {
      heading: "Option: reject unknown slugs in middleware",
      level: 3,
      paragraphs: [
        "The Next.js docs also suggest checking the slug before rendering at all, in middleware (renamed Proxy in newer versions), and returning a 404 there. This is the most reliable way to get the right status when a segment has to keep its `loading.js`.",
        "Keep it fast. Middleware runs on every matching request, so check against a small list or a key-value store, not a full database query. The trade-off: a bare 404 response from middleware skips your styled `not-found.js` page, so return simple HTML or rewrite to a static 404 route if the design matters.",
      ],
      code: {
        language: "js",
        content: `// middleware.js
import { NextResponse } from "next/server";
import slugs from "./generated/blog-slugs.json"; // written at build or publish time

const known = new Set(slugs);

export function middleware(req) {
  const slug = req.nextUrl.pathname.split("/")[2];
  if (slug && !known.has(slug)) {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.next();
}

export const config = { matcher: ["/blog/:slug"] };`,
      },
    },
    {
      heading: "How to test the real status code",
      level: 2,
      paragraphs: [
        "Browser DevTools can mislead you because client-side navigation never makes a full document request. Test the document directly with curl, against a production build (`next build && next start`) or the deployed site.",
        "On Next.js 15.2 and later, run the same check with a bot user agent too, since bots in the HTML-limited list get blocking metadata while a plain curl request does not.",
      ],
      code: {
        language: "bash",
        content: `# expect 404
curl -s -o /dev/null -w "%{http_code}\\n" https://example.com/blog/does-not-exist

# same URL as an HTML-limited bot would request it
curl -s -o /dev/null -w "%{http_code}\\n" -A "Mozilla/5.0 (compatible; bingbot/2.0)" \\
  https://example.com/blog/does-not-exist

# a streamed 404 has this tag even when the status is 200
curl -s https://example.com/blog/does-not-exist | grep -o '<meta name="robots"[^>]*>'`,
      },
    },
    {
      heading: "Gotchas",
      level: 2,
      bullets: [
        "`notFound()` throws a special error. If you call it inside `try { ... } catch {}`, the catch swallows it. Return a value from the try block and call `notFound()` after it.",
        "`not-found.js` at the root only handles unmatched URLs and `notFound()` calls. It does not change the status code on its own.",
        "Don't fix this by redirecting missing pages to the homepage. Google can treat irrelevant redirects to the homepage as soft 404s too.",
        "After deploying, use URL Inspection in Search Console on one of the reported URLs and request validation of the Soft 404 issue so Google rechecks them.",
      ],
      paragraphs: [],
    },
  ],
  faq: [
    {
      question: "Is a streamed 404 with noindex harmful for SEO?",
      answer:
        "Not badly. The noindex tag keeps the URL out of search results. It is still worth fixing, because Search Console reports these URLs as soft 404s, monitoring tools see a 200, and caches may store the page as a success.",
    },
    {
      question: "Does loading.js hurt SEO?",
      answer:
        "No, streamed HTML is still fully server-rendered and Google can read it. The only SEO cost is the status code problem: inside a segment with loading.js, missing pages return 200 unless you reject them before rendering, for example in middleware.",
    },
    {
      question: "How do I return a 410 Gone for deleted posts in Next.js?",
      answer:
        "`notFound()` always produces a 404. To send 410, handle the removed slugs in middleware and return a response with status 410. Google treats 404 and 410 similarly over time, so a 404 is fine for most sites.",
    },
    {
      question: "Why does my 404 look correct in development but not in production?",
      answer:
        "Development mode renders differently and doesn't cache. Production adds static rendering and caching, so a missing slug can be served from a cached 200 render. Test against `next start` or the deployed site, and make dynamic routes render per request or use `dynamicParams = false` for fixed lists.",
    },
  ],
  sources: [
    { title: "Next.js docs: loading.js (status codes and streaming)", url: "https://nextjs.org/docs/app/api-reference/file-conventions/loading" },
    { title: "Next.js docs: notFound()", url: "https://nextjs.org/docs/app/api-reference/functions/not-found" },
    { title: "Next.js docs: htmlLimitedBots", url: "https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots" },
    { title: "Next.js docs: generateStaticParams and dynamicParams", url: "https://nextjs.org/docs/app/api-reference/functions/generate-static-params" },
    { title: "Google Search Central: HTTP status codes and network errors", url: "https://developers.google.com/search/docs/crawling-indexing/http-network-errors" },
  ],
};

export default post;
