import { renderOg, ogSize, ogContentType } from "../../lib/og.jsx";

export const alt = "JavaScript notes and projects by Tushar Gautam";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Language notes",
    title: "JavaScript",
    accent: "in practice.",
    subtitle: "React, Next.js, Node.js, GSAP & Three.js — in production.",
    tags: ["React", "Next.js", "Node.js", "GSAP"],
  });
}
