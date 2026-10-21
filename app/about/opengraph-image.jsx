import { renderOg, ogSize, ogContentType } from "../lib/og.jsx";

export const alt = "About Tushar Gautam — full-stack & AI product engineer from Punjab, India";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "About me",
    title: "I build the future of the web",
    accent: "from Bharat.",
    subtitle: "Frontend-focused full-stack developer shipping production AI SaaS end to end.",
    tags: ["React", "Next.js", "Flask", "PostgreSQL", "Gemini API"],
    photo: true,
  });
}
