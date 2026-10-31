Live: https://tushargautam.software

Next.js 14 (app router) portfolio, deployed on Vercel. Copy `.env.example` to `.env.local` and fill in what you need.

## AI blog (`/blog`)

Two kinds of posts:

- **Hand-written** posts live in `app/content/posts/*.js` (registered in `index.js`). They're merged with generated posts everywhere and render even without a database.
- **Generated** posts are written by Gemini and stored in MongoDB. Most runs (`evergreen`) take real Google search queries from Google Autocomplete in areas Tushar has shipped code in (`app/lib/topics.js`); about 20% (`trending`) use Hacker News / DEV.to stories. Gemini reads the relevant official docs with the URL context tool, writes a structured post (short answer, takeaways, code, tables, FAQ, first-person note limited to real projects), and a quality check (`app/lib/postFormat.js`) triggers one repair pass. Posts that still fail are saved as drafts. New posts are pinged to IndexNow.

1. Set `MONGO_URI`, `GEMINI_API_KEY` and `CRON_SECRET` in Vercel → Project → Settings → Environment Variables, then redeploy.
2. In Vercel → Settings → **Functions**, make sure **Fluid Compute** is enabled. Generation can take 1–3 minutes; without Fluid Compute Hobby functions are cut off at 60s.
3. On [cron-job.org](https://cron-job.org) create a job:
   - **URL:** `https://tushargautam.software/api/cron/generate-blog` (must not redirect)
   - **Schedule:** every 2 hours (crontab `0 */2 * * *`)
   - **Advanced → Headers:** `Authorization: Bearer <CRON_SECRET>`
   - The endpoint answers `202` immediately and writes the post in the background (cron-job.org times out at 30s), so the job shows as successful.
   - Runs closer together than `BLOG_MIN_INTERVAL_MINUTES` (default 720, so about 2 posts a day) are skipped with `200 {"skipped": true}`. Fewer, better posts: Google's scaled-content-abuse policy targets sites that mass-produce AI pages.

Useful manual calls (same header):

| URL | What it does |
| --- | --- |
| `/api/cron/generate-blog?status=1` | **Start here when debugging:** last 10 runs with success / error / timed-out and the step it stopped at |
| `/api/cron/generate-blog?dryRun=1` | Lists the topic candidates — no Gemini call, nothing saved (add `&mode=evergreen` or `&mode=trending`) |
| `/api/cron/generate-blog?wait=1` | Generates a post and returns the result (may take 1–4 minutes) |
| `/api/cron/generate-blog?topic=Next.js%2016` | Writes about a specific topic instead of scraping |
| `/api/cron/generate-blog?force=1` | Ignores the minimum interval |
| `/api/cron/generate-blog?mode=trending` | Forces the topic mode for this run |
| `/api/cron/generate-blog?indexnow=1` | Submits every blog URL to IndexNow (run once after setting `INDEXNOW_KEY`) |

In a browser you can pass the secret as `&key=<CRON_SECRET>` instead of the header.

Set `BLOG_AUTO_PUBLISH=false` to save posts as drafts (flip `status` to `published` in MongoDB to publish).

## SEO

- Per-page metadata (title, description, canonical, OG, Twitter) via `pageMetadata()` in `app/lib/seo.js`.
- OG/Twitter images are generated from `app/lib/og.jsx` by each route's `opengraph-image.jsx`.
- Analytics / Search Console: set `NEXT_PUBLIC_GA_ID` and `GOOGLE_SITE_VERIFICATION`, redeploy, then submit `/sitemap.xml` in Search Console.
- RSS feed at `/blog/feed.xml`, linked from every page. Submit it in Search Console next to the sitemap.
- IndexNow: set `INDEXNOW_KEY` (served at `/indexnow-key.txt`); new posts are submitted to Bing and other IndexNow engines on publish.
- No `llms.txt`: Google's [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) says Search doesn't use it.
- Cache and security headers (Vercel's equivalent of `.htaccess`) live in `next.config.js`; `middleware.js` redirects mixed-case URLs to lowercase.
