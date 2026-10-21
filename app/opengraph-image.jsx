import { renderOg, ogSize, ogContentType } from "./lib/og.jsx";

export const alt = "Tushar Gautam — Full-Stack & AI Product Engineer building AI SaaS with React, Next.js and Gemini";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Full-Stack & AI Product Engineer",
    title: "Building AI-native products",
    accent: "that ship.",
    subtitle: "React, Next.js, Flask & Gemini — production AI SaaS from India.",
    tags: ["bubbl.ooo", "bhavishai.in", "salesji.com", "makeperfectads.com"],
    photo: true,
  });
}
