const post = {
  slug: "aeo-geo-llms-txt-what-actually-works",
  publishedAt: "2026-10-31T07:30:00.000Z",
  primaryQuery: "does llms.txt help seo",
  title: "AEO, GEO and llms.txt in 2026: What Google Says Actually Works",
  metaTitle: "Does llms.txt Help SEO? What Google Says About AEO and GEO",
  metaDescription:
    "Google's 2026 guide says AEO and GEO are just SEO and llms.txt is ignored. What still matters for AI Overviews, ChatGPT search and Copilot, from a developer.",
  excerpt:
    "Google now says plainly what helps in AI Overviews and AI Mode and what to ignore, llms.txt included. Here is the short version, plus what I changed on my own blog.",
  category: "Web Development",
  tags: ["SEO", "AI search", "GEO"],
  keywords: [
    "does llms.txt help seo",
    "aeo vs seo",
    "generative engine optimization",
    "how to appear in ai overviews",
    "indexnow chatgpt search",
    "scaled content abuse",
  ],
  tldr:
    "Not for Google. Its 2026 guide to generative AI search says AI Overviews and AI Mode run on core Search ranking, so AEO and GEO are just SEO, and that you can ignore llms.txt, content chunking and rewriting for AI. What helps is original, first-hand content on crawlable, indexed pages. For Bing-powered AI tools, IndexNow gets new pages discovered faster.",
  keyTakeaways: [
    "Google's AI features retrieve pages from the normal Search index (RAG plus query fan-out), so a page has to rank and be indexable with a snippet first.",
    "Google lists llms.txt, \"chunking\", AI-specific rewrites and inauthentic mentions as things site owners can ignore.",
    "The guide's main advice is non-commodity content: a unique, experienced point of view, not a summary of what's already online.",
    "Publishing many near-identical AI pages to catch every query variation is named as scaled content abuse.",
    "Search Console has a Generative AI performance report for measuring this.",
  ],
  authorNote:
    "I learned this on this blog. Its first generator rewrote trending Hacker News and Google Trends headlines every two hours, and Search Console showed close to no impressions. I rebuilt it around specific questions in areas I've shipped code in, and wrote this post with the same rules.",
  sections: [
    {
      heading: "What did Google actually say about AI search?",
      level: 2,
      paragraphs: [
        "Google's \"Guide to Optimizing for Generative AI Features on Google Search\" (last updated July 2026) answers the question directly: SEO best practices still apply, because AI Overviews and AI Mode are rooted in the core ranking and quality systems.",
        "It describes two mechanisms. Retrieval-augmented generation pulls relevant pages from the Search index to ground the answer. Query fan-out runs several related searches in parallel to cover sub-questions. Both start from pages that already rank, which is why the guide calls AEO and GEO simply SEO from Google's point of view.",
        "To be eligible at all, a page has to be indexed and eligible to show with a snippet. If you've set `nosnippet` or blocked crawling, you've opted out.",
      ],
    },
    {
      heading: "Does llms.txt help SEO or AI visibility?",
      level: 2,
      paragraphs: [
        "llms.txt was proposed by Jeremy Howard of Answer.AI in September 2024: a Markdown file at your domain root listing the pages you want language models to read. It's easy to add, which is why it spread fast.",
        "Google's guide lists it among things you don't need, saying Google Search itself doesn't use such files. Independent studies of server logs reported that AI crawlers rarely request the file at all. The file doesn't hurt, but don't expect traffic from it. Its real use is narrower: documentation sites where coding agents are pointed at it on purpose.",
      ],
    },
    {
      heading: "What does \"non-commodity content\" mean for a developer blog?",
      level: 2,
      paragraphs: [
        "Google's example contrasts a generic \"7 tips\" article with a first-hand account of a specific decision. For developers, commodity content is a tutorial that restates the docs, or a hot take on this morning's headline. Hundreds of pages already say the same thing, and an AI answer can generate it on its own.",
        "Non-commodity content is what only you can write: the exact error message you hit, the config that fixed it, the trade-off you chose and why. My post on [why notFound() returns 200 in Next.js](/blog/nextjs-notfound-200-soft-404-fix) is built that way, from changes in this site's code.",
      ],
      bullets: [
        "Start with the direct answer, then the detail. That's good writing for people, and it's what gets quoted.",
        "Show real code, real config and the real error text people paste into search.",
        "Say where you used it, and only claim what you actually did.",
        "Cover the gotchas and when not to use the approach. Summaries rarely do.",
      ],
    },
    {
      heading: "What can you safely skip?",
      level: 2,
      paragraphs: [
        "This is the guide's mythbusting list, next to what it recommends instead.",
      ],
      table: {
        headers: ["Tactic", "Google's position", "Do instead"],
        rows: [
          ["llms.txt or other AI text files", "Not used by Google Search", "Make sure normal pages are crawlable"],
          ["Chunking content into tiny pieces", "Not required", "Organise with clear headings for readers"],
          ["Rewriting pages for AI systems", "Not needed; AI understands synonyms", "Write clearly for your audience"],
          ["Chasing inauthentic mentions", "Not helpful", "Earn real mentions with useful work"],
          ["Special schema.org markup for AI", "Not required", "Keep normal structured data for rich results"],
          ["One page per query variation", "Can violate scaled content abuse policy", "One thorough page per real problem"],
        ],
      },
    },
    {
      heading: "What about ChatGPT search, Copilot and other AI tools?",
      level: 2,
      paragraphs: [
        "These tools are not Google, and several rely on Bing's index in some form. Bing recommends IndexNow for submitting new and updated URLs, and Bing, Yandex, Naver, Seznam and Yep participate. Google does not use IndexNow; for Google, keep your sitemap current and submit it in Search Console.",
        "IndexNow is small to add. You host a key file on your domain and POST changed URLs. This site pings it whenever a post is published.",
      ],
      code: {
        language: "js",
        content: `// POST new or changed URLs to IndexNow (shared with all participating engines)
await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: "example.com",
    key: process.env.INDEXNOW_KEY, // also served at keyLocation
    keyLocation: "https://example.com/indexnow-key.txt",
    urlList: ["https://example.com/blog/new-post"],
  }),
});
// 200 or 202 means accepted`,
      },
    },
    {
      heading: "The risk with AI-generated posts at scale",
      level: 2,
      paragraphs: [
        "Google's guidance on AI-generated content is not anti-AI. It says using generative tools to create many pages without adding value for users may violate the scaled content abuse policy, which has existed since March 2024 and applies however the pages are made.",
        "So the fix for an AI blog is not more posts. I cut this site's generator to about two posts a day, made it answer real search queries in areas I work in, required a direct answer, code where relevant and a first-hand note limited to things I've actually built, and added a quality check that saves weak drafts instead of publishing them. You can see how that pipeline works in the post on [running long jobs on Vercel Hobby](/blog/vercel-hobby-long-running-cron-job).",
      ],
    },
    {
      heading: "A short checklist",
      level: 3,
      paragraphs: [],
      bullets: [
        "Every page you care about is indexable, has a self-referencing canonical and appears in the sitemap.",
        "Titles and descriptions say exactly what the page answers.",
        "The answer is in the first paragraph; detail, code and caveats follow.",
        "Author, date and real experience are visible on the page, with a link to an about page.",
        "Missing pages return a real 404, not a 200.",
        "Search Console is verified, the sitemap is submitted, and you check the Generative AI performance report.",
        "For Bing and the tools built on it, IndexNow is wired to your publish step.",
      ],
    },
  ],
  faq: [
    {
      question: "Is AEO different from SEO?",
      answer:
        "For Google, no. Its guide says optimizing for generative AI search is optimizing for search, because AI Overviews and AI Mode retrieve pages from the regular index using the same ranking systems.",
    },
    {
      question: "Should I still add an llms.txt file?",
      answer:
        "Only if you have a reason beyond SEO, such as documentation you want coding agents to read. Google says it doesn't use the file, and published log studies found AI crawlers rarely fetch it.",
    },
    {
      question: "How do I see if my pages appear in AI Overviews?",
      answer:
        "Use the Generative AI performance report in Google Search Console. It shows how your content performs in generative AI features in Search and Discover.",
    },
    {
      question: "Does structured data help with AI Overviews?",
      answer:
        "Google says no special markup is needed for generative AI features. Structured data is still worth keeping because it makes pages eligible for rich results such as breadcrumbs and article details.",
    },
  ],
  sources: [
    { title: "Google: Guide to optimizing for generative AI features on Google Search", url: "https://developers.google.com/search/docs/fundamentals/ai-optimization-guide" },
    { title: "Google: Guidance on using generative AI content", url: "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content" },
    { title: "Google: Spam policies (scaled content abuse)", url: "https://developers.google.com/search/docs/essentials/spam-policies" },
    { title: "llmstxt.org: The /llms.txt file proposal", url: "https://llmstxt.org/" },
    { title: "IndexNow documentation", url: "https://www.indexnow.org/documentation" },
    { title: "Bing Webmaster Tools: URL submission and IndexNow", url: "https://www.bing.com/webmasters/help/URL-Submission-62f2860b" },
  ],
};

export default post;
