import Link from "next/link";

// Renders the tiny inline syntax used in blog text: `code` and [text](href).
// Everything else is plain text (React escapes it), so model output can't
// inject HTML. Hrefs are limited to site paths and https URLs.
const TOKEN = /(`[^`\n]{1,200}`|\[[^\]\n]{1,120}\]\([^)\s]{1,300}\))/g;

export default function RichText({ text }) {
  if (!text) return null;
  return text.split(TOKEN).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="rounded bg-[color:rgba(244,239,230,0.07)] px-1.5 py-0.5 text-[0.9em] text-[color:var(--ink)]">
          {part.slice(1, -1)}
        </code>
      );
    }
    const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (m) {
      const [, label, href] = m;
      const cls = "text-[color:var(--amber)] underline underline-offset-4 hover:text-[color:var(--amber-bright)]";
      if (href.startsWith("/")) {
        return (
          <Link key={i} href={href} className={cls}>
            {label}
          </Link>
        );
      }
      if (href.startsWith("https://")) {
        return (
          <a key={i} href={href} target="_blank" rel="noopener noreferrer" className={cls}>
            {label}
          </a>
        );
      }
      return label;
    }
    return part;
  });
}
