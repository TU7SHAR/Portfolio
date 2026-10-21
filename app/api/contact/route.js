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

    // 1) Notification to Tushar — this is the important one.
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

    // 2) Auto-reply / confirmation to the visitor — best-effort. If this
    // fails we don't fail the request, since the message already reached the
    // inbox above. `replyTo` points back to Tushar so replies route correctly.
    try {
      await transporter.sendMail({
        from: `"Tushar Gautam" <${from}>`,
        to: email.trim(),
        replyTo: to,
        subject: "Thanks for reaching out — I got your message",
        text: `Hi ${name.trim()},\n\nThanks for getting in touch through my portfolio — your message landed safely and I'll get back to you soon.\n\nFor your records, here's what you sent:\n\nSubject: ${subject.trim()}\n\n${message.trim()}\n\n— Tushar Gautam\nFull-Stack & AI Product Engineer\n${contactInfo.github}`,
        html: `
          <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:560px;margin:0 auto;background:#0c0b09;color:#f4efe6;padding:32px;border-radius:12px">
            <p style="letter-spacing:.28em;text-transform:uppercase;font-size:11px;color:#e0a049;margin:0 0 14px">Message received</p>
            <h2 style="font-size:22px;margin:0 0 14px;color:#f4efe6;font-weight:600">Thanks, ${safeName} 👋</h2>
            <p style="margin:0 0 16px;color:#cdc6b8;line-height:1.6">
              Your message reached me safely and I&apos;ll get back to you as soon as I can — usually within a day or two.
              In the meantime, feel free to explore my work or connect with me anywhere below.
            </p>
            <div style="border:1px solid rgba(244,239,230,.12);border-radius:8px;padding:16px;margin:18px 0;background:rgba(244,239,230,.02)">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#8f887a">Your message</p>
              <p style="margin:0 0 6px;color:#f4efe6"><strong>${safeSubject}</strong></p>
              <div style="color:#cdc6b8;line-height:1.6">${safeMessage}</div>
            </div>
            <p style="margin:20px 0 4px;color:#f4efe6;font-weight:600">Tushar Gautam</p>
            <p style="margin:0 0 14px;color:#8f887a;font-size:14px">Full-Stack &amp; AI Product Engineer</p>
            <p style="margin:0">
              <a href="${contactInfo.github}" style="color:#e0a049;text-decoration:none;margin-right:14px">GitHub</a>
              <a href="${contactInfo.linkedin}" style="color:#e0a049;text-decoration:none;margin-right:14px">LinkedIn</a>
              <a href="https://tushargautam.software" style="color:#e0a049;text-decoration:none">Portfolio</a>
            </p>
            <p style="margin:22px 0 0;color:#5f594e;font-size:11px">This is an automated confirmation — no need to reply to this email.</p>
          </div>`,
      });
    } catch (autoErr) {
      console.error("Auto-reply failed (non-fatal):", autoErr?.message || autoErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact send failed:", err?.message || err);
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please try again or email directly." },
      { status: 502 }
    );
  }
}
