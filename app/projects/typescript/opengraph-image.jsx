import { renderOg, ogSize, ogContentType } from "../../lib/og.jsx";

export const alt = "TypeScript notes and projects by Tushar Gautam";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Language notes",
    title: "TypeScript",
    accent: "in practice.",
    subtitle: "Typed React & Next.js code that catches bugs before users do.",
    tags: ["TypeScript", "React", "Next.js"],
  });
}
