import LanguagePage from "../LanguagePage.jsx";
import { pageMetadata } from "../../lib/seo.js";

export const metadata = pageMetadata({
  title: "TypeScript Notes & Projects — Tushar Gautam, Web Developer",
  description:
    "How Tushar Gautam uses TypeScript for safer React and Next.js code: typed props, API contracts and stricter builds that catch bugs before they reach production.",
  path: "/projects/typescript",
  keywords: ["TypeScript developer", "TypeScript React", "Next.js TypeScript", "type safety"],
});

export default function Page() {
  return (
    <LanguagePage
      lang={{
        slug: "typescript",
        name: "TypeScript",
        h1: "TypeScript",
        img: "/typescript.png",
        alt: "TypeScript TS logo",
        intro:
          "TypeScript is JavaScript that tells you you're wrong before your users do. I use it when a codebase needs to grow without breaking.",
        sections: [
          {
            heading: "Why I use TypeScript",
            items: [
              { title: "Typed components", text: "Props and state with explicit types make React components self-documenting and safe to refactor." },
              { title: "API contracts", text: "Shared types between server and client mean a changed field fails the build instead of failing in production." },
              { title: "Better tooling", text: "Autocomplete, inline docs and safe renames make day-to-day work faster, not slower." },
            ],
          },
          {
            heading: "How I adopt it",
            text: "Gradually. Next.js lets JavaScript and TypeScript live side by side — this site's sitemap, robots and manifest files are already TypeScript — so I can add types where they pay off most without rewriting everything.",
          },
        ],
        reference: { label: "TypeScript handbook", url: "https://www.typescriptlang.org/docs/" },
      }}
    />
  );
}
