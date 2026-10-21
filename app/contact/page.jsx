import Reveal from "../(components)/Reveal.jsx";
import JsonLd from "../(components)/JsonLd.jsx";
import ContactForm from "./ContactForm.jsx";
import { pageMetadata, breadcrumbJsonLd } from "../lib/seo.js";

export const metadata = pageMetadata({
  title: "Contact Tushar Gautam — Hire a Full-Stack & AI Developer",
  description:
    "Contact Tushar Gautam to hire a full-stack & AI developer for React, Next.js or Flask work. Open to freelance projects, full-time roles and collaborations.",
  path: "/contact",
  keywords: ["hire full-stack developer", "hire Next.js developer India", "freelance AI developer", "contact Tushar Gautam"],
});

export default function Page() {
  return (
    <main className="content-layer max-w-6xl mx-auto px-6 md:px-10">
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            url: "https://tushargautam.software/contact",
            mainEntity: { "@id": "https://tushargautam.software/#person" },
          },
        ]}
      />
      <Reveal className="max-w-3xl mb-14 mt-4">
        <p className="eyebrow mb-4">Contact</p>
        <h1 className="font-display text-5xl sm:text-6xl leading-[1.02] mb-6">
          Let&apos;s build something{" "}
          <span className="serif-accent">worth shipping.</span>
        </h1>
        <p className="text-lg text-[color:var(--ink-soft)] leading-relaxed">
          Have a project, a role, or just want to say hi? Drop me a line — I&apos;m
          always open to interesting problems and good conversations.
        </p>
      </Reveal>

      <ContactForm />
    </main>
  );
}
