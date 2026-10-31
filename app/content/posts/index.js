// Hand-written posts that live in the repo instead of MongoDB. They are merged
// with the generated posts everywhere (blog index, post page, sitemap, feed),
// so they show up even if the database is unreachable.
//
// To add one: create a file next to these with the same shape, import it below.

import { sanitizePost } from "../../lib/postFormat.js";
import nextjsSoft404 from "./nextjs-notfound-soft-404.js";
import vercelHobbyCron from "./vercel-hobby-long-running-cron.js";
import geminiStructured from "./gemini-structured-output-rest.js";
import aeoGeo from "./aeo-geo-what-works.js";
import razorpay from "./razorpay-signature-nextjs.js";

const RAW = [nextjsSoft404, vercelHobbyCron, geminiStructured, aeoGeo, razorpay];

// inline links in these posts may point at each other and the main pages
const ALLOWED = new Set(["/", "/projects", "/about", "/contact", "/blog", ...RAW.map((p) => `/blog/${p.slug}`)]);

export const staticPosts = RAW.map((raw) => ({
  ...sanitizePost(raw, ALLOWED, { allowExternal: true }),
  slug: raw.slug,
  sources: raw.sources || [],
  publishedAt: raw.publishedAt,
  updatedAt: raw.updatedAt || raw.publishedAt,
  status: "published",
  handwritten: true,
}));
