import { renderOg, ogSize, ogContentType } from "../lib/og.jsx";

export const alt = "Tushar Gautam’s tech blog — AI, web development and trending technology";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "The blog",
    title: "Notes on AI, the web &",
    accent: "what’s trending.",
    subtitle: "Fresh takes on trending tech, written for developers and builders.",
    tags: ["AI", "Web Development", "Tech News", "Startups"],
  });
}
