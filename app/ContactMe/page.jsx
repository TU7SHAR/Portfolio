import Reveal from "../(components)/Reveal.jsx";
import ContactForm from "./ContactForm.jsx";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Tushar Gautam — full-stack & AI product engineer. Available for freelance, full-time roles, and interesting collaborations.",
  alternates: { canonical: "/ContactMe" },
};

export default function Page() {
  return (
    <main className="content-layer max-w-6xl mx-auto px-6 md:px-10">
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
