import { renderOg, ogSize, ogContentType } from "../lib/og.jsx";

export const alt = "Projects by Tushar Gautam — production AI SaaS, RAG chatbots and web apps";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Selected work",
    title: "Things I have designed, built",
    accent: "& shipped.",
    subtitle: "Production AI SaaS — RAG chatbots, AI astrology, Telegram sales agents and AI video ads.",
    tags: ["bubbl.ooo", "bhavishai.in", "salesji.com", "makeperfectads.com"],
  });
}
