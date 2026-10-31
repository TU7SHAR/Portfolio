const post = {
  slug: "vercel-hobby-long-running-cron-job",
  publishedAt: "2026-10-31T05:30:00.000Z",
  primaryQuery: "vercel hobby cron job longer than 60 seconds",
  title: "Run a 3-Minute Background Job on Vercel Hobby with cron-job.org",
  metaTitle: "Vercel Hobby Cron: Run Jobs Longer Than 60s (waitUntil)",
  metaDescription:
    "Vercel Hobby cron runs once a day and cron-job.org times out at 30s. Use Fluid Compute, a 202 response and waitUntil to run a 3-minute job every 2 hours.",
  excerpt:
    "The pattern this site uses to run a 1-3 minute AI job every two hours on the free Vercel plan: Fluid Compute, an immediate 202, waitUntil, and a run log you can check.",
  category: "DevOps & Cloud",
  tags: ["Vercel", "Next.js", "Cron"],
  keywords: [
    "vercel hobby cron",
    "vercel function timeout hobby",
    "vercel waitUntil",
    "cron-job.org vercel",
    "vercel maxDuration 300",
    "vercel fluid compute",
    "maxDuration between 1 and 60 for plan hobby",
  ],
  tldr:
    "Vercel Hobby cron jobs can only run once a day, and cron-job.org closes the connection after 30 seconds. To run a longer job more often, enable Fluid Compute (Hobby functions then get up to 300 seconds), set `maxDuration = 300`, answer the cron request with 202 right away, and finish the work inside `waitUntil()` from `@vercel/functions` (or `after()` on Next.js 15.1+).",
  keyTakeaways: [
    "On Hobby with Fluid Compute, 300 seconds is both the default and the maximum function duration. Pro goes up to 800 seconds.",
    "Work passed to `waitUntil()` shares the function's timeout. It buys you time after the response, not extra time overall.",
    "Abort your own slow calls a little before `maxDuration`, so your catch block can record the failure before the platform kills the function.",
    "Store one document per run with its last stage. A `?status=1` endpoint beats digging through function logs.",
    "Guard against double triggers with an in-progress check and a minimum interval between runs.",
  ],
  authorNote:
    "This is how the AI blog on this site runs: cron-job.org calls one Next.js route every two hours on the Vercel Hobby plan, and the route generates a post with Gemini in the background, which takes one to three minutes.",
  sections: [
    {
      heading: "What limits are you working around?",
      level: 2,
      paragraphs: [
        "Three limits collide here. Vercel's built-in cron on Hobby only accepts schedules that run once per day; an hourly expression fails the deployment. External schedulers fix the frequency, but cron-job.org waits at most 30 seconds for a response. And the function itself has a maximum duration.",
      ],
      table: {
        headers: ["Limit", "Value", "Source"],
        rows: [
          ["Vercel cron on Hobby", "Once per day", "Vercel cron usage and pricing docs"],
          ["Function duration, Hobby with Fluid Compute", "300s default and maximum", "Vercel functions limits"],
          ["Function duration, Pro/Enterprise", "300s default, 800s maximum", "Vercel functions limits"],
          ["cron-job.org request timeout", "30 seconds", "cron-job.org FAQ"],
        ],
      },
    },
    {
      heading: "The pattern: respond 202, keep working with waitUntil",
      level: 2,
      paragraphs: [
        "The route authenticates the caller, creates a run record, starts the job inside `waitUntil()`, and returns 202 Accepted within a second or two. cron-job.org sees a fast 2xx and logs a success. Vercel keeps the function alive until the promise settles or `maxDuration` is reached.",
        "On Next.js 15.1 and later, Vercel recommends the built-in `after()` from `next/server` for the same job. This site is on Next.js 14, so it uses `waitUntil()`.",
      ],
      code: {
        language: "js",
        content: `// app/api/cron/job/route.js
import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // Hobby max, needs Fluid Compute

function authorized(req) {
  const secret = process.env.CRON_SECRET || "";
  const header = req.headers.get("authorization") || "";
  const a = Buffer.from(header.replace(/^Bearer /, ""));
  const b = Buffer.from(secret);
  return secret && a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req) {
  if (!authorized(req)) return NextResponse.json({ ok: false }, { status: 401 });
  const run = await Run.create({ status: "running", stage: "start" });
  waitUntil(doTheWork(run)); // keeps running after the response
  return NextResponse.json({ ok: true, runId: String(run._id) }, { status: 202 });
}`,
      },
    },
    {
      heading: "Turn on Fluid Compute first",
      level: 3,
      paragraphs: [
        "The 300-second Hobby limit applies to functions running on Fluid Compute. Without it, Hobby functions are capped at 60 seconds, and setting `maxDuration = 300` failed my deployment with: `Serverless Functions must have a maxDuration between 1 and 60 for plan hobby`.",
        "Enable Fluid Compute in the project's Settings, under Functions, or commit it in `vercel.json` so it can't be switched off by accident.",
      ],
      code: {
        language: "json",
        content: `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "fluid": true
}`,
      },
    },
    {
      heading: "Record every run so failures are visible",
      level: 2,
      paragraphs: [
        "Background work fails quietly: cron-job.org already got its 202. I store one small document per run with the stage it reached (scrape, generate, save, revalidate, done), the error message and the duration, and expire those documents after 30 days with a TTL index.",
        "A `?status=1` query on the same route returns the last ten runs. A run still marked running after `maxDuration` plus a margin was killed by the platform, and the stage tells you where.",
      ],
      code: {
        language: "js",
        content: `const RunSchema = new Schema(
  {
    status: { type: String, enum: ["running", "success", "skipped", "error"], default: "running" },
    stage: String,
    error: String,
    ms: Number,
  },
  { timestamps: true }
);
// delete runs after 30 days
RunSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

async function doTheWork(run) {
  const stage = (s, extra = {}) => Run.updateOne({ _id: run._id }, { stage: s, ...extra });
  const started = Date.now();
  try {
    await stage("fetch");
    // ...
    await stage("done", { status: "success", ms: Date.now() - started });
  } catch (err) {
    await Run.updateOne({ _id: run._id }, { status: "error", error: err.message, ms: Date.now() - started });
  }
}`,
      },
    },
    {
      heading: "Stop slow calls before Vercel stops you",
      level: 2,
      paragraphs: [
        "If an API call is still running when the function hits `maxDuration`, the whole invocation is cancelled and your catch block never runs. Give long calls their own deadline that ends before the platform's, using whatever time is left.",
        "`AbortSignal.timeout()` works with `fetch` in Node.js 18 and later. `@vercel/functions` also exposes `getDeadline()`, which returns the invocation's shared deadline if you'd rather compute the budget from that.",
      ],
      code: {
        language: "js",
        content: `const budgetMs = (maxDuration - 45) * 1000 - (Date.now() - started);
const res = await fetch(apiUrl, {
  method: "POST",
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(Math.max(20_000, budgetMs)),
});`,
      },
    },
    {
      heading: "Prevent double runs",
      level: 2,
      paragraphs: [
        "Schedulers retry, people click \"run now\", and a job set to every 15 minutes by mistake can flood your database. Two cheap checks cover it: skip if a run started within the last `maxDuration` seconds is still marked running, and skip if the last successful result is newer than your minimum interval. Return 200 with `skipped: true`, so the scheduler doesn't log an intentional skip as a failure.",
      ],
      code: {
        language: "js",
        content: `const running = await Run.findOne({
  status: "running",
  createdAt: { $gt: new Date(Date.now() - (maxDuration + 30) * 1000) },
});
if (running) return NextResponse.json({ ok: true, skipped: true, reason: "in progress" });`,
      },
    },
    {
      heading: "How to set up the job on cron-job.org",
      level: 2,
      paragraphs: [
        "cron-job.org is free and takes a couple of minutes to configure. These are the settings this site uses for a job that runs every two hours.",
      ],
      bullets: [
        "URL: the full production URL of the route, for example `https://example.com/api/cron/job`, exactly as it resolves with no redirect.",
        "Schedule: every 2 hours, or the crontab expression `0 */2 * * *`.",
        "Advanced, Headers: add `Authorization` with the value `Bearer <your CRON_SECRET>`.",
        "Method: GET is fine if your route exports a GET handler; this site exports the same handler for GET and POST.",
        "Notifications: turn on failure emails. Because the route answers 202 quickly, a failure here means auth, routing or a cold-start problem, not the job itself.",
      ],
    },
    {
      heading: "What one run looks like, second by second",
      level: 3,
      paragraphs: [
        "Here is the time budget this site's blog job is designed around, which helps when deciding where to put your own deadlines. Actual times vary from run to run, mostly with how long the model takes.",
      ],
      table: {
        headers: ["Time", "What happens", "Who is waiting"],
        rows: [
          ["0-2s", "cron-job.org calls the route; auth check; run document created; 202 returned", "cron-job.org (30s limit)"],
          ["2-10s", "Topic discovery: a few small HTTP requests in parallel", "Nobody; waitUntil keeps the function alive"],
          ["10-190s", "Gemini researches and writes the post (the slow part)", "Bounded by an AbortSignal set well before 300s"],
          ["190-260s", "Optional repair pass if quality checks fail, only if enough time is left", "Same budget"],
          ["last ~40s", "Save to MongoDB, revalidate pages, ping IndexNow, mark the run done", "Reserved so the run is always recorded"],
        ],
      },
    },
    {
      heading: "Gotchas I ran into",
      level: 2,
      paragraphs: [],
      bullets: [
        "Point the cron job at the final URL. A redirect, for example apex domain to www, can drop the Authorization header, and the job starts failing with 401.",
        "On Next.js 14, my calls to `revalidatePath()` from inside the background work didn't refresh the pages, so the job calls its own route with a `?revalidate=` flag once the post is saved, and that request revalidates.",
        "Compare secrets with `crypto.timingSafeEqual` and check lengths first, because it throws on buffers of different length.",
        "Keep the cron secret in an environment variable and send it as a header. A secret in the query string ends up in logs.",
      ],
    },
  ],
  faq: [
    {
      question: "Can I use Vercel Cron instead of cron-job.org on the Hobby plan?",
      answer:
        "Only for jobs that run once a day. Hobby rejects cron expressions that would run more often at deploy time. Paid plans allow more frequent schedules; on Hobby, an external scheduler such as cron-job.org is the usual workaround.",
    },
    {
      question: "Does waitUntil give my function more time?",
      answer:
        "No. Promises passed to waitUntil share the function's own timeout and are cancelled if it times out. It only lets you send the response first and keep working until maxDuration.",
    },
    {
      question: "What if my job needs more than 300 seconds?",
      answer:
        "Split it into steps that each finish within the limit and chain them, for example by storing progress and letting the next trigger continue. Pro raises the maximum to 800 seconds; beyond that, use a queue or a long-running worker.",
    },
    {
      question: "Why return 202 instead of 200?",
      answer:
        "202 Accepted means the request was taken but the work isn't finished, which is exactly what happened. Schedulers treat any 2xx as success, so either works for cron-job.org, but 202 makes logs easier to read.",
    },
  ],
  sources: [
    { title: "Vercel docs: Functions limits", url: "https://vercel.com/docs/functions/limitations" },
    { title: "Vercel docs: Cron jobs usage and pricing", url: "https://vercel.com/docs/cron-jobs/usage-and-pricing" },
    { title: "Vercel docs: @vercel/functions (waitUntil, getDeadline)", url: "https://vercel.com/docs/functions/functions-api-reference/vercel-functions-package" },
    { title: "Vercel docs: Fluid compute", url: "https://vercel.com/docs/fluid-compute" },
    { title: "cron-job.org FAQ", url: "https://cron-job.org/en/faq/" },
  ],
};

export default post;
