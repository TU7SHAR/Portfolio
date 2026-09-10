"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "../(components)/Reveal.jsx";
import contactInfo from "../utils/contactInfo.js";

const channels = [
  { label: "Email", value: contactInfo.email, href: `mailto:${contactInfo.email}?subject=Redirected%20From%20Portfolio` },
  { label: "WhatsApp", value: contactInfo.phoneDisplay, href: contactInfo.whatsapp },
  { label: "LinkedIn", value: "in/tushar-gautam", href: contactInfo.linkedin },
  { label: "GitHub", value: `@${contactInfo.githubUser}`, href: contactInfo.github },
];

function mailtoFallback({ name, email, subject, message }) {
  const body = `Hi Tushar,%0D%0A%0D%0A${encodeURIComponent(
    message
  )}%0D%0A%0D%0A---%0D%0AFrom: ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
  window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(
    subject
  )}&body=${body}`;
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const ready =
    form.name.trim() && form.email.trim() && form.subject.trim() && form.message.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ready || form.website || status === "sending") return;
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "", website: "" });
        return;
      }

      // SMTP not set up yet → seamlessly fall back to the user's mail client
      if (data.code === "SMTP_NOT_CONFIGURED") {
        mailtoFallback(form);
        setStatus("idle");
        return;
      }

      setStatus("error");
      setError(data.error || "Something went wrong. Please try again.");
    } catch {
      // network failure → fall back to mailto so the message is never lost
      mailtoFallback(form);
      setStatus("idle");
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mb-24 items-start">
        {/* Form */}
        <Reveal className="card p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center text-center py-10">
              <div className="grid h-14 w-14 place-items-center rounded-full border border-[color:var(--amber)]/60 mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="font-display text-2xl mb-2">Message sent</h3>
              <p className="text-[color:var(--ink-soft)] max-w-sm">
                Thanks for reaching out — I&apos;ll get back to you soon. Meanwhile, feel
                free to connect on any channel.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="btn-ghost mt-6 inline-flex items-center px-5 py-2 text-sm"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Your name">
                  <input type="text" value={form.name} onChange={set("name")} placeholder="Ada Lovelace" className="cf-input" required />
                </Field>
                <Field label="Your email">
                  <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" className="cf-input" required />
                </Field>
              </div>
              <Field label="Subject">
                <input type="text" value={form.subject} onChange={set("subject")} placeholder="Let's work together" className="cf-input" required />
              </Field>
              <Field label="Message">
                <textarea rows={7} value={form.message} onChange={set("message")} placeholder="Tell me about your idea, timeline, and what you need..." className="cf-input resize-none" required />
              </Field>
              {/* honeypot */}
              <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} className="hidden" aria-hidden="true" />

              {status === "error" && (
                <p className="text-sm text-red-400" role="alert">
                  {error}{" "}
                  <button type="button" onClick={() => mailtoFallback(form)} className="underline hover:text-[color:var(--amber)]">
                    email me directly
                  </button>
                  .
                </p>
              )}

              <button
                type="submit"
                disabled={!ready || status === "sending"}
                className="btn-amber mt-2 inline-flex items-center justify-center gap-2 px-7 py-3 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {status === "sending" ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.27 3.13A59.77 59.77 0 0 1 21.49 12 59.77 59.77 0 0 1 3.27 20.88L6 12Zm0 0h7.5" />
                    </svg>
                  </>
                )}
              </button>
              <p className="text-xs text-[color:var(--ink-mute)] text-center">
                Your message is delivered straight to my inbox.
              </p>
            </form>
          )}
        </Reveal>

        {/* Channels */}
        <Reveal stagger className="flex flex-col gap-3">
          {channels.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              target={c.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer noopener"
              className="card group p-5 flex items-center justify-between text-left"
            >
              <div>
                <p className="eyebrow mb-1">{c.label}</p>
                <p className="text-[color:var(--ink)]">{c.value}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-[color:var(--ink-mute)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[color:var(--amber)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
              </svg>
            </Link>
          ))}
        </Reveal>
      </div>

      <style jsx global>{`
        .cf-input {
          width: 100%;
          border-radius: 4px;
          border: 1px solid rgba(244, 239, 230, 0.12);
          background: rgba(244, 239, 230, 0.03);
          padding: 0.75rem 1rem;
          color: var(--ink);
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .cf-input::placeholder { color: var(--ink-mute); }
        .cf-input:focus {
          border-color: rgba(224, 160, 73, 0.7);
          box-shadow: 0 0 0 3px rgba(224, 160, 73, 0.12);
        }
      `}</style>
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-[color:var(--ink-soft)]">{label}</span>
      {children}
    </label>
  );
}
