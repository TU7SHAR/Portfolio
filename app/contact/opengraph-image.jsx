import { renderOg, ogSize, ogContentType } from "../lib/og.jsx";

export const alt = "Contact Tushar Gautam — hire a full-stack & AI developer";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Contact",
    title: "Let’s build something",
    accent: "worth shipping.",
    subtitle: "Open to freelance projects, full-time roles and interesting collaborations.",
    tags: ["Freelance", "Full-time", "AI SaaS", "Next.js"],
  });
}
