"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "../(components)/Reveal.jsx";

const TO = "gautams4work@gmail.com";

const channels = [
  {
    label: "Email",
    value: "gautams4work@gmail.com",
    href: "mailto:gautams4work@gmail.com?subject=Redirected%20From%20Portfolio",
  },
  {
    label: "WhatsApp",
    value: "+91 97804 00311",
    href: "https://wa.me/919780400311",
  },
  {
    label: "LinkedIn",
    value: "in/tushar-gautam",
    href: "https://www.linkedin.com/in/tushar-gautam-73a678314/",
  },
  {
    label: "GitHub",
    value: "@TU7SHAR",
    href: "https://github.com/TU7SHAR",
  },
];

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  // simple spam honeypot — real users never fill this
  const [website, setWebsite] = useState("");

  const ready = name.trim() && email.trim() && subject.trim() && message.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ready || website) return;

    const body = `Hi Tushar,%0D%0A%0D%0A${encodeURIComponent(
      message
    )}%0D%0A%0D%0A---%0D%0AFrom: ${encodeURIComponent(
      name
    )} (${encodeURIComponent(email)})`;

    const mailto = `mailto:${TO}?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;

    window.location.href = mailto;
  };

  return (
    <main className="content-layer max-w-6xl mx-auto md:px-16 px-6 text-white">
      <Reveal className="max-w-2xl mb-12 mt-4">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400 mb-3">
          Contact
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6 leading-tight">
          Let&apos;s build something{" "}
          <span className="gradient-text">great</span> together
        </h1>
        <p className="text-base text-zinc-400 leading-relaxed">
          Have a project, a role, or just want to say hi? Drop me a line —
          I&apos;m always open to interesting problems and good conversations.
        </p>
      </Reveal>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 mb-24 items-start">
        {/* Form */}
        <Reveal className="glass-card rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Your name">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  className="cf-input"
                  required
                />
              </Field>
              <Field label="Your email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="cf-input"
                  required
                />
              </Field>
            </div>

            <Field label="Subject">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Let's work together"
                className="cf-input"
                required
              />
            </Field>

            <Field label="Message">
              <textarea
                rows={7}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your idea, timeline, and what you need..."
                className="cf-input resize-none"
                required
              />
            </Field>

            {/* honeypot (visually hidden) */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />

            <button
              type="submit"
              disabled={!ready}
              className="glow-btn mt-2 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-medium text-white transition-transform enabled:hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send message
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.27 3.13A59.77 59.77 0 0 1 21.49 12 59.77 59.77 0 0 1 3.27 20.88L6 12Zm0 0h7.5"
                />
              </svg>
            </button>
            <p className="text-xs text-zinc-500 text-center">
              This opens your email app with everything pre-filled — no sign-in
              needed.
            </p>
          </form>
        </Reveal>

        {/* Channels */}
        <Reveal stagger className="flex flex-col gap-4">
          {channels.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer noopener"
              className="glass-card group rounded-2xl p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-violet-300 mb-1">
                  {c.label}
                </p>
                <p className="text-zinc-200">{c.value}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5 text-zinc-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 17 17 7M7 7h10v10"
                />
              </svg>
            </Link>
          ))}
        </Reveal>
      </div>

      <style jsx global>{`
        .cf-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          padding: 0.75rem 1rem;
          color: #fff;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .cf-input::placeholder {
          color: rgba(161, 161, 170, 0.6);
        }
        .cf-input:focus {
          border-color: rgba(139, 39, 218, 0.7);
          box-shadow: 0 0 0 3px rgba(139, 39, 218, 0.15);
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-zinc-400">{label}</span>
      {children}
    </label>
  );
}
