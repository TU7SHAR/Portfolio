import LanguagePage from "../LanguagePage.jsx";
import { pageMetadata } from "../../lib/seo.js";

export const metadata = pageMetadata({
  title: "C Programming Notes & Projects — Tushar Gautam, Developer",
  description:
    "How Tushar Gautam uses C: memory, pointers and systems basics, plus wiring the C-based Swiss Ephemeris library into the bhavishai.in AI astrology platform.",
  path: "/projects/c",
  keywords: ["C programming", "pointers and memory", "Swiss Ephemeris", "systems programming"],
});

export default function Page() {
  return (
    <LanguagePage
      lang={{
        slug: "c",
        name: "C",
        h1: "C",
        img: "/C.png",
        alt: "C programming language logo",
        intro:
          "C is where I learned how programs really run: memory, pointers and the cost of every instruction. It's small, unforgiving and still underneath almost everything — including tools I use in production today.",
        sections: [
          {
            heading: "C in a real product",
            text: "bhavishai.in, my AI astrology platform, relies on Swiss Ephemeris — a C library — to calculate planetary longitudes and dashas from a user's birth details. Integrating it meant understanding C data types, precision and error codes, then exposing the results cleanly to the rest of the app.",
          },
          {
            heading: "Fundamentals I lean on",
            items: [
              { title: "Memory and pointers", text: "Stack vs heap, manual allocation and why buffer sizes matter — lessons that make higher-level languages make more sense." },
              { title: "Data representation", text: "Integer sizes, floating-point precision and structs — essential when numbers from a C library feed calculations users rely on." },
              { title: "Thinking in systems", text: "Compilation, linking and how a process talks to the operating system." },
            ],
          },
        ],
        reference: { label: "C language reference (cppreference)", url: "https://en.cppreference.com/w/c" },
      }}
    />
  );
}
