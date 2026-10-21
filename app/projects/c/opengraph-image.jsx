import { renderOg, ogSize, ogContentType } from "../../lib/og.jsx";

export const alt = "C notes and projects by Tushar Gautam";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Language notes",
    title: "C",
    accent: "in practice.",
    subtitle: "Systems basics, pointers & memory — and the C library behind bhavishai.in.",
    tags: ["C", "Pointers", "Swiss Ephemeris"],
  });
}
