import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";

export default async function Project() {
  return (
    <>
      <main className="max-w-6xl mx-auto lg:px-16 px-8 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <h1 className="font-bold lg:text-5xl text-3xl lg:leading-tight mb-4">
              JavaScript
            </h1>

            <Link
              href="https://cplusplus.com/"
              rel="noreferrer noopener"
              className="bg-[#1d1d20] text-white hover:border-zinc-700 border border-transparent rounded-md px-4 py-2"
            >
              Explore
            </Link>
          </div>
          <div className="flex gap-x-8">
            <Image
              className="rounded-sm border border-zinc-800"
              width={200}
              height={90}
              src="/c++.png"
              alt="img"
            />
            <Image
              className="rounded-sm border border-zinc-800"
              width={200}
              height={90}
              src="/c++.png"
              alt="img"
            />
            <Image
              className="rounded-sm border border-zinc-800"
              width={200}
              height={90}
              src="/c++.png"
              alt="img"
            />
          </div>
          <div className="flex flex-col gap-y-6 mt-8 leading-7 text-zinc-400">
            <p>
              C++ was designed with systems programming and embedded,
              resource-constrained software and large systems in mind, with
              performance, efficiency, and flexibility of use as its design
              highlights. C++ has also been found useful in many other contexts,
              with key strengths being software infrastructure and
              resource-constrained applications, including desktop applications,
              video games, servers (e.g. e-commerce, web search, or databases),
              and performance-critical applications (e.g. telephone switches or
              space probes).
            </p>
            <p>
              C++ is standardized by the International Organization for
              Standardization (ISO), with the latest standard version ratified
              and published by ISO in December 2020 as ISO/IEC 14882:2020
              (informally known as C++20). The C++ programming language was
              initially standardized in 1998 as ISO/IEC 14882:1998, which was
              then amended by the C++03, C++11, C++14, and C++17 standards. The
              current C++20 standard supersedes these with new features and an
              enlarged standard library. Before the initial standardization in
              1998, C++ was developed by Stroustrup at Bell Labs since 1979 as
              an extension of the C language; he wanted an efficient and
              flexible language similar to C that also provided high-level
              features for program organization. Since 2012, C++ has been on a
              three-year release schedule with C++23 as the next planned
              standard
            </p>
            <pre className="text-yellow-400">
              *All Definations/Introductions Have been sourced from Original
              Sites!!
            </pre>
          </div>
        </div>
      </main>
    </>
  );
}
