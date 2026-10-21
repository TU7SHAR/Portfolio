// Single source of truth for projects, languages, technologies and tools —
// used by the home page, /projects and /about.

// Affiliation / status badges shown next to each project.
export const BADGES = {
  current: { label: "Currently building", tone: "live" },
  personal: { label: "Personal · Private", tone: "outline" },
  drish: { label: "DrishInfoTech · Internship", tone: "org" },
  paused: { label: "Paused", tone: "muted" },
};

export const flagship = [
  {
    name: "makeperfectads.com",
    tag: "AI Video Ad Generator",
    href: "https://www.makeperfectads.com",
    badges: ["current", "personal"],
    desc: "Paste a link and the Studio reads the page, picks real product images and brand colours, plans a shot-by-shot ad, then produces a short 9:16 or 16:9 video with captions, voiceover and music — in 84 languages, including Hinglish.",
    points: [
      "Pipeline: read page → collect product images & brand look → plan shots → generate AI video → mix voiceover & music",
      "84 languages plus 14 mixed styles (Hinglish, Tanglish, Spanglish…), including right-to-left captions",
      "Automatic pre-download checks for audio loudness, unsupported claims and link validity",
      "Exports 8–20s MP4 in 9:16 (Reels, TikTok, Shorts) or 16:9, at 1080p or 720p",
    ],
    stack: ["AI Video", "Web Scraping", "Voiceover · TTS", "84 Languages", "MP4 Export"],
  },
  {
    name: "bhavishai.in",
    tag: "AI Astrology Platform",
    href: "https://bhavishai.in",
    badges: ["personal"],
    desc: "Swiss Ephemeris (a C library) computes planetary longitudes and dashas from birth details, and Gemini turns them into personalised reports — wrapped in a full Razorpay payment-to-delivery pipeline.",
    points: [
      "Razorpay signature verification, background PDF generation & email dispatch",
      "Admin reconciliation system for failed deliveries",
      "Protected admin panel with revenue dashboards & user-journey analytics",
    ],
    stack: ["Next.js", "Swiss Ephemeris", "Gemini AI", "Razorpay", "PostgreSQL"],
  },
  {
    name: "bubbl.ooo",
    tag: "RAG Chatbot SaaS",
    href: "https://app.bubbl.ooo",
    badges: ["drish"],
    desc: "A multi-tenant RAG chatbot platform where scraped web content is auto-vectorized into Gemini FileSearch stores, letting businesses deploy context-aware AI agents with persistent conversations and lead capture.",
    points: [
      "Background job processing with Celery + Redis for web scraping",
      "Deployed on a VPS with Gunicorn (gthread) + systemd service management",
      "Similar in spirit to chatbase.co, built end to end",
    ],
    stack: ["Python Flask", "Gemini API", "Redis · Celery", "PostgreSQL", "Paddle"],
  },
  {
    name: "salesji.com",
    tag: "AI Telegram Bot Workspace",
    href: "https://app.salesji.com",
    badges: ["drish"],
    desc: "A workspace for building and managing AI-powered Telegram sales bots — businesses deploy conversational agents that engage leads and automate sales conversations right inside Telegram.",
    points: [
      "Configure and deploy AI sales agents to Telegram from a single workspace",
      "Automates lead engagement and sales conversations end to end",
      "Built as a multi-tenant SaaS product",
    ],
    stack: ["Telegram Bot API", "AI Agents", "Next.js", "PostgreSQL"],
  },
];

export const moreProjects = [
  {
    name: "Stoccy",
    tag: "Stock charts",
    img: "/st.png",
    alt: "Stoccy stock market app screenshot",
    href: "https://stoccy.vercel.app/",
    desc: "Search international stocks and view interactive price charts. Built with Next.js and Tailwind, using the Finnhub API for market data and Recharts for the charts.",
    stack: ["Next.js", "Finnhub API", "Recharts"],
  },
  {
    name: "certBuilder",
    tag: "Certificate generator",
    img: "/cb.png",
    alt: "certBuilder certificate generator logo",
    href: "https://cb-gilt.vercel.app/",
    desc: "A certificate builder: design a certificate once, fill in recipient details and export ready-to-share certificates. Next.js app with its own data models.",
    stack: ["Next.js", "Tailwind CSS"],
  },
  {
    name: "DeScript",
    tag: "Automation scripts",
    img: "/desc.png",
    alt: "DeScript wordmark logo",
    href: "https://github.com/TU7SHAR/DeScript",
    desc: "A web front end for running automation scripts on apps like Telegram — for example leaving every channel or clearing chats in one go — powered by Python scripts behind a Next.js UI.",
    stack: ["Python", "Telegram API", "Next.js"],
  },
  {
    name: "Contact Form",
    tag: "Client front end",
    img: "/cfm.png",
    alt: "North contact form app icon",
    href: "https://github.com/TU7SHAR/contact-north",
    desc: "A responsive contact form front end built for North with Next.js and Tailwind — clean validation and layout, ready to plug into any email backend.",
    stack: ["Next.js", "Tailwind CSS"],
  },
];

export const languages = [
  { name: "JavaScript", img: "/javascript.png", alt: "JavaScript JS logo", href: "/projects/javascript", desc: "Everyday language — React, Next.js, Node.js, GSAP and Three.js." },
  { name: "TypeScript", img: "/typescript.png", alt: "TypeScript TS logo", href: "/projects/typescript", desc: "Typed React & Next.js code and API contracts that scale." },
  { name: "Python", mono: "Py", desc: "Flask back ends, Celery workers, Telegram automation and OpenCV tools." },
  { name: "SQL", mono: "SQL", desc: "PostgreSQL & MySQL schemas, queries and reporting for SaaS products." },
  { name: "C++", img: "/c++.png", alt: "C++ programming language logo", href: "/projects/cpp", desc: "Data structures & algorithms on LeetCode and CodeChef." },
  { name: "C", img: "/C.png", alt: "C programming language logo", href: "/projects/c", desc: "Systems fundamentals — and the Swiss Ephemeris library behind bhavishai.in." },
  { name: "GLSL", mono: "GL", desc: "WebGL shaders for Three.js scenes and animated visuals." },
];

export const technologies = [
  { label: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS", "shadcn/ui", "Three.js · R3F", "GSAP", "HTML5 · CSS3"] },
  { label: "Backend", items: ["Node.js", "Flask", "REST APIs", "Celery", "Gunicorn", "NextAuth", "Nodemailer"] },
  { label: "Databases & caching", items: ["PostgreSQL", "MongoDB", "MySQL", "Redis"] },
  { label: "AI & LLMs", items: ["Gemini API", "RAG · vector search", "AI agents", "Prompt engineering", "AI video & TTS"] },
  { label: "APIs & integrations", items: ["Telegram Bot API", "Razorpay", "Paddle", "Swiss Ephemeris", "Finnhub", "OpenCV"] },
];

export const tools = [
  { label: "Agentic & AI-assisted coding", items: ["Kiro", "GitHub Copilot", "MCP servers", "Google AI Studio"] },
  { label: "Build & ship", items: ["Git & GitHub", "Vercel", "Linux VPS · systemd", "MongoDB Atlas", "cron-job.org"] },
  { label: "Test & debug", items: ["Postman", "Chrome DevTools", "LeetCode · CodeChef"] },
];
