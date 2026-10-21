import { renderOg, ogSize, ogContentType } from "../../lib/og.jsx";

export const alt = "C++ notes and projects by Tushar Gautam";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({
    eyebrow: "Language notes",
    title: "C++",
    accent: "in practice.",
    subtitle: "Data structures & algorithms on LeetCode and CodeChef.",
    tags: ["C++", "STL", "DSA", "LeetCode"],
  });
}
