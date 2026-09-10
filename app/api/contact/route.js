import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import contactInfo from "../../utils/contactInfo.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// naive in-memory rate limit (per warm serverless instance) — a light
// deterrent, not a hard guarantee.
const HITS = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip) {
  const now = Date.now();
  const entry = HITS.get(ip) || { count: 0, start: now };
  if (now - entry.start > WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  HITS.set(ip, entry);
  return entry.count > MAX_PER_WINDOW;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const { name, email, subject, message, website } = body || {};

  // honeypot: real users never fill this
  if (website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // validation
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json(
      { ok: false, error: "All fields are required." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email.trim())) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (message.trim().length > 5000 || name.trim().length > 120) {
    return NextResponse.json(
      { ok: false, error: "Message is too long." },
      { status: 400 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages — please try again shortly." },
      { status: 429 }
    );
  }

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    CONTACT_TO,
  } = process.env;

  // If SMTP isn't configured, tell the client so it can fall back to mailto.
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return NextResponse.json(
      { ok: false, code: "SMTP_NOT_CONFIGURED", error: "Mail service is not configured." },
      { status: 503 }
    );
  }

  const port = Number(SMTP_PORT) || 587;
  const to = CONTACT_TO || contactInfo.email;
  const from = SMTP_FROM || SMTP_USER;

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465, // implicit TLS on 465, STARTTLS otherwise
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const safeName = esc(name.trim());
    const safeEmail = esc(email.trim());
    const safeSubject = esc(subject.trim());
    const safeMessage = esc(message.trim()).replace(/\n/g, "<br/>");

    await transporter.sendMail({
      from: `"Portfolio Contact" <${from}>`,
      to,
      replyTo: `"${safeName}" <${email.trim()}>`,
      subject: `Portfolio · ${subject.trim()}`,
      text: `New message from your portfolio contact form\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${subject.trim()}\n\n${message.trim()}`,
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;background:#0c0b09;color:#f4efe6;padding:28px;border-radius:10px">
          <p style="letter-spacing:.28em;text-transform:uppercase;font-size:11px;color:#e0a049;margin:0 0 12px">New enquiry</p>
          <h2 style="font-size:20px;margin:0 0 16px;color:#f4efe6">${safeSubject}</h2>
          <p style="margin:0 0 6px;color:#cdc6b8"><strong style="color:#f4efe6">From:</strong> ${safeName}</p>
          <p style="margin:0 0 18px;color:#cdc6b8"><strong style="color:#f4efe6">Email:</strong> <a href="mailto:${safeEmail}" style="color:#e0a049">${safeEmail}</a></p>
          <div style="border-top:1px solid rgba(244,239,230,.12);padding-top:16px;color:#cdc6b8;line-height:1.6">${safeMessage}</div>
        </div>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact send failed:", err?.message || err);
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please try again or email directly." },
      { status: 502 }
    );
  }
}
