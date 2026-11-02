import { renderOg, ogSize, ogContentType } from "../lib/og.jsx";

export const alt = "Tushar Gautam’s blog — notes from building AI products with Next.js and the Gemini API";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "The blog",
    title: "Notes from building",
    accent: "AI products.",
    subtitle: "First-hand guides on Next.js, the Gemini API, Vercel and shipping AI SaaS.",
    tags: ["Next.js", "Gemini API", "Vercel", "AI SaaS"],
  });
}
