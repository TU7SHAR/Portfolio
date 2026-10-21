import LanguagePage from "../LanguagePage.jsx";
import { pageMetadata } from "../../lib/seo.js";

export const metadata = pageMetadata({
  title: "JavaScript Projects & Notes — Tushar Gautam, Web Developer",
  description:
    "How Tushar Gautam uses JavaScript across React, Next.js and Node.js, from GSAP and Three.js animations to the production AI SaaS products he builds and ships.",
  path: "/projects/javascript",
  keywords: ["JavaScript developer", "React", "Next.js", "Node.js", "GSAP", "Three.js"],
});

export default function Page() {
  return (
    <LanguagePage
      lang={{
        slug: "javascript",
        name: "JavaScript",
        h1: "JavaScript",
        img: "/javascript.png",
        alt: "JavaScript JS logo",
        intro:
          "JavaScript is my everyday language. It runs this portfolio, the front ends of my SaaS products and a good share of their back ends too.",
        sections: [
          {
            heading: "Where I use JavaScript",
            items: [
              { title: "React & Next.js", text: "Server components, streaming and static generation for fast, SEO-friendly pages — like the one you're reading." },
              { title: "Motion and 3D", text: "GSAP timelines and Three.js / React Three Fiber scenes, tuned to respect reduced-motion settings and low-power devices." },
              { title: "Node.js APIs", text: "Route handlers for contact forms, auth and the Gemini-powered blog generator on this site." },
            ],
          },
          {
            heading: "Projects built with it",
            text: "salesji.com and bhavishai.in are built on Next.js, and smaller apps like Stoccy and certBuilder are pure front-end JavaScript. Each one taught me something about performance, state and shipping to real users.",
          },
        ],
        reference: { label: "MDN JavaScript guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      }}
    />
  );
}
