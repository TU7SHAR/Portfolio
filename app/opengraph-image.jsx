import { renderOg, ogSize, ogContentType } from "./lib/og.jsx";

export const alt = "Tushar Gautam — AI engineer shipping production AI SaaS with agentic, AI-assisted development";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "AI Engineer · Agentic development",
    title: "Building AI-native products",
    accent: "that ship.",
    subtitle: "React, Next.js & Python — shipped faster with agentic, AI-assisted coding.",
    tags: ["makeperfectads.com", "bhavishai.in", "bubbl.ooo", "salesji.com"],
    photo: true,
  });
}
