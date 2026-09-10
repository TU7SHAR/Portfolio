"use client";

import { useEffect, useState, useRef } from "react";
import Reveal from "./Reveal.jsx";

const USER = "TU7SHAR";
// amber intensity ramp (level 0..4)
const LEVELS = [
  "rgba(244,239,230,0.06)", // empty
  "rgba(224,160,73,0.28)",
  "rgba(224,160,73,0.5)",
  "rgba(224,160,73,0.75)",
  "#f2b866", // hottest
];

function levelFor(count, max) {
  if (!count) return 0;
  const q = count / Math.max(max, 1);
  if (q > 0.66) return 4;
  if (q > 0.4) return 3;
  if (q > 0.15) return 2;
  return 1;
}

// build a plausible static fallback so the chart never looks empty/broken
function buildFallback() {
  const days = [];
  const today = new Date();
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const base = Math.random();
    const count =
      base > 0.55 ? Math.floor(base * 9) : base > 0.3 ? Math.floor(base * 3) : 0;
    days.push({ date: d.toISOString().slice(0, 10), count });
  }
  return days;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function GithubActivity() {
  const [days, setDays] = useState(null);
  const [total, setTotal] = useState(null);
  const [live, setLive] = useState(false);
  const grid = useRef(null);
  const scroller = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("bad status");
        const data = await res.json();
        const contribs = (data.contributions || []).map((c) => ({
          date: c.date,
          count: c.count,
        }));
        if (!contribs.length) throw new Error("empty");
        if (alive) {
          setDays(contribs.slice(-364));
          const t =
            data.total && (data.total.lastYear ?? Object.values(data.total)[0]);
          setTotal(t ?? contribs.reduce((s, c) => s + c.count, 0));
          setLive(true);
        }
      } catch (e) {
        if (alive) {
          const fb = buildFallback();
          setDays(fb);
          setTotal(fb.reduce((s, c) => s + c.count, 0));
          setLive(false);
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // animate squares in once data lands, then snap the scroller to the most
  // recent weeks (right edge) so mobile shows the LATEST activity first.
  useEffect(() => {
    if (!days || !grid.current) return;
    const cells = grid.current.querySelectorAll(".gh-cell");
    cells.forEach((cell, i) => {
      cell.style.opacity = "0";
      cell.style.transform = "scale(0.4)";
      const delay = (i % 60) * 4 + Math.floor(i / 60) * 6;
      setTimeout(() => {
        cell.style.transition =
          "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)";
        cell.style.opacity = "1";
        cell.style.transform = "scale(1)";
      }, 200 + delay);
    });
    // jump to the right (most recent) — where the real activity is
    if (scroller.current) {
      scroller.current.scrollLeft = scroller.current.scrollWidth;
    }
  }, [days]);

  const max = days ? Math.max(...days.map((d) => d.count)) : 0;

  // group into weeks (columns)
  const weeks = [];
  if (days) {
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  }

  // month labels: mark the week where a new month first appears
  const monthLabels = weeks.map((week, wi) => {
    const first = week[0];
    if (!first) return null;
    const d = new Date(first.date);
    const prev = wi > 0 ? new Date(weeks[wi - 1][0].date) : null;
    if (!prev || prev.getMonth() !== d.getMonth()) {
      return { wi, label: MONTHS[d.getMonth()] };
    }
    return null;
  });

  return (
    <section className="content-layer max-w-6xl mx-auto px-6 md:px-10 my-16 sm:my-28">
      <Reveal className="flex items-end justify-between flex-wrap gap-4 mb-6 sm:mb-8">
        <div>
          <p className="eyebrow mb-4">Activity</p>
          <h2 className="font-display text-4xl sm:text-5xl">
            Always <span className="serif-accent">building.</span>
          </h2>
        </div>
        <a
          href={`https://github.com/${USER}`}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-center gap-1.5 text-sm text-[color:var(--ink-soft)] hover:text-[color:var(--amber)] transition-colors"
        >
          @{USER} on GitHub
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
          </svg>
        </a>
      </Reveal>

      <Reveal className="card p-6 sm:p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <p className="text-[color:var(--ink-soft)]">
            {total != null ? (
              <>
                <span className="text-[color:var(--ink)] font-medium">
                  {total.toLocaleString()}
                </span>{" "}
                contributions in the last year
              </>
            ) : (
              "Loading contributions…"
            )}
          </p>
          {!live && total != null && (
            <span className="text-xs text-[color:var(--ink-mute)]">
              live data unavailable — showing a sample
            </span>
          )}
        </div>

        {/* scroll container starts at the most-recent (right) edge on mobile;
            edge fades hint that it scrolls. */}
        <div className="relative">
          <div
            ref={scroller}
            className="overflow-x-auto pb-2 gh-scroll"
            aria-label="GitHub contribution graph for the last year"
          >
            <div className="min-w-max">
              {/* month labels */}
              <div className="flex gap-[3px] mb-1.5">
                {weeks.map((_, wi) => (
                  <div key={wi} className="w-[13px] shrink-0">
                    {monthLabels[wi] && (
                      <span className="block text-[10px] leading-none text-[color:var(--ink-mute)] whitespace-nowrap">
                        {monthLabels[wi].label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {/* squares */}
              <div ref={grid} className="flex gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((day, di) => (
                      <span
                        key={di}
                        className="gh-cell h-[13px] w-[13px] rounded-[3px]"
                        style={{ background: LEVELS[levelFor(day.count, max)] }}
                        title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* left/right fade hints for scrollability */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[color:var(--surface)] to-transparent sm:hidden" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[color:var(--surface)] to-transparent sm:hidden" />
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-[color:var(--ink-mute)]">
          <span>Less</span>
          {LEVELS.map((c, i) => (
            <span
              key={i}
              className="h-[13px] w-[13px] rounded-[3px]"
              style={{ background: c }}
            />
          ))}
          <span>More</span>
        </div>
      </Reveal>

      <style jsx>{`
        .gh-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(224, 160, 73, 0.5) transparent;
        }
        .gh-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .gh-scroll::-webkit-scrollbar-thumb {
          background: rgba(224, 160, 73, 0.5);
          border-radius: 3px;
        }
      `}</style>
    </section>
  );
}
