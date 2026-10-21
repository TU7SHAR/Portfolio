import LanguagePage from "../LanguagePage.jsx";
import { pageMetadata } from "../../lib/seo.js";

export const metadata = pageMetadata({
  title: "C++ Notes & DSA Practice — Tushar Gautam, Full-Stack Dev",
  description:
    "How Tushar Gautam uses C++ for data structures and algorithms on LeetCode and CodeChef: STL, complexity analysis and the problem-solving habits behind his work.",
  path: "/projects/cpp",
  keywords: ["C++ DSA", "LeetCode C++", "CodeChef", "competitive programming", "C++ STL"],
});

export default function Page() {
  return (
    <LanguagePage
      lang={{
        slug: "cpp",
        name: "C++",
        h1: "C++",
        img: "/c++.png",
        alt: "C++ programming language logo",
        intro:
          "C++ is the language I reach for when I'm practising data structures and algorithms. It's fast, it's strict, and its standard library gives you just enough help without hiding what the machine is really doing.",
        sections: [
          {
            heading: "How I use C++",
            text: "Most of my C++ lives in problem-solving: regular practice on LeetCode and CodeChef. That habit of breaking a problem down, picking the right data structure and reasoning about time and memory carries straight over into the web and AI products I build.",
          },
          {
            heading: "What I focus on",
            items: [
              { title: "The STL", text: "vector, map, unordered_map, set, priority_queue and the algorithms header — knowing which container fits a problem is half the solution." },
              { title: "Complexity analysis", text: "Estimating Big-O before writing code, so a solution passes the constraints the first time instead of timing out." },
              { title: "Core patterns", text: "Two pointers, sliding windows, binary search on the answer, BFS/DFS, dynamic programming and greedy proofs." },
            ],
          },
        ],
        reference: { label: "cplusplus.com reference", url: "https://cplusplus.com/reference/" },
      }}
    />
  );
}
