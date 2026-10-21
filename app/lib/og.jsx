import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Shared 1200×630 Open Graph / Twitter card, styled like the site:
// warm charcoal, amber glow, Fraunces display serif, ivory text.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const C = {
  bg: "#0c0b09",
  ink: "#f4efe6",
  soft: "#cdc6b8",
  mute: "#8f887a",
  amber: "#e0a049",
  line: "rgba(244,239,230,0.12)",
};

const asset = (...p) => readFile(join(process.cwd(), ...p));

let fontsPromise;
const loadFonts = () =>
  (fontsPromise ||= Promise.all([
    asset("assets/fonts/Fraunces-Medium.ttf"),
    asset("assets/fonts/Fraunces-MediumItalic.ttf"),
    asset("assets/fonts/Inter-Regular.ttf"),
    asset("assets/fonts/Inter-SemiBold.ttf"),
  ]).then(([fr, frI, inter, interB]) => [
    { name: "Fraunces", data: fr, weight: 500, style: "normal" },
    { name: "Fraunces", data: frI, weight: 500, style: "italic" },
    { name: "Inter", data: inter, weight: 400, style: "normal" },
    { name: "Inter", data: interB, weight: 600, style: "normal" },
  ]));

let photoPromise;
const loadPhoto = () =>
  (photoPromise ||= asset("public/Tushar.jpg").then(
    (b) => `data:image/jpeg;base64,${b.toString("base64")}`
  ));

/**
 * @param {object} o
 * @param {string} o.eyebrow  small amber uppercase label
 * @param {string} o.title    main headline
 * @param {string} [o.accent] trailing words rendered in amber italic
 * @param {string} [o.subtitle]
 * @param {string[]} [o.tags] chips along the bottom
 * @param {boolean} [o.photo] show the profile photo on the right
 */
export async function renderOg({ eyebrow, title, accent, subtitle, tags = [], photo = false }) {
  const [fonts, img] = await Promise.all([loadFonts(), photo ? loadPhoto() : null]);
  const long = (title + (accent || "")).length + (photo ? 14 : 0) + (subtitle?.length > 70 ? 8 : 0);
  const titleSize = long > 70 ? 52 : long > 50 ? 62 : 74;
  // render word-by-word so wrapped lines never inherit an indent
  const words = [
    ...title.split(" ").map((w) => ({ w, accent: false })),
    ...(accent ? accent.split(" ").map((w) => ({ w, accent: true })) : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: C.bg,
          fontFamily: "Inter",
          color: C.ink,
          overflow: "hidden",
        }}
      >
        {/* amber glows */}
        <div
          style={{
            position: "absolute", top: -260, right: -180, width: 760, height: 760, borderRadius: 9999,
            background: "radial-gradient(circle, rgba(224,160,73,0.34) 0%, rgba(224,160,73,0.08) 45%, rgba(12,11,9,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: -320, left: -200, width: 700, height: 700, borderRadius: 9999,
            background: "radial-gradient(circle, rgba(184,122,46,0.22) 0%, rgba(12,11,9,0) 65%)",
          }}
        />
        {/* frame */}
        <div style={{ position: "absolute", inset: 28, border: `1px solid ${C.line}`, borderRadius: 18, display: "flex" }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 76px", width: "100%" }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 50, height: 50, borderRadius: 9999, border: `2px solid ${C.amber}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Fraunces", fontSize: 26, color: C.amber,
                }}
              >
                T
              </div>
              <div style={{ fontFamily: "Fraunces", fontSize: 30 }}>Tushar Gautam</div>
            </div>
            <div style={{ fontSize: 22, color: C.mute, letterSpacing: 1 }}>tushargautam.software</div>
          </div>

          {/* body */}
          <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: 6, color: C.amber, textTransform: "uppercase", marginBottom: 22 }}>
                {eyebrow}
              </div>
              <div
                style={{
                  display: "flex", flexWrap: "wrap", columnGap: Math.round(titleSize * 0.26),
                  fontFamily: "Fraunces", fontSize: titleSize, lineHeight: 1.08, letterSpacing: -1,
                }}
              >
                {words.map(({ w, accent: a }, i) => (
                  <span key={i} style={a ? { fontStyle: "italic", color: C.amber } : {}}>
                    {w}
                  </span>
                ))}
              </div>
              {subtitle && (
                <div style={{ marginTop: 22, fontSize: photo ? 24 : 26, lineHeight: 1.4, color: C.soft, maxWidth: 820 }}>{subtitle}</div>
              )}
            </div>
            {img && (
              <div style={{ display: "flex", padding: 6, borderRadius: 9999, border: `2px solid ${C.amber}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                <img src={img} width={230} height={230} style={{ borderRadius: 9999, objectFit: "cover" }} />
              </div>
            )}
          </div>

          {/* footer */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {tags.slice(0, 5).map((t) => (
              <div
                key={t}
                style={{
                  display: "flex", fontSize: 20, color: C.soft, padding: "8px 18px",
                  borderRadius: 9999, border: `1px solid ${C.line}`, background: "rgba(244,239,230,0.04)",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts }
  );
}
