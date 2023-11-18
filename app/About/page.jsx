import Image from "next/image";
import Link from "next/link";
import React from "react";
import "../globals.css";
import { NextSeo } from "next-seo";

const page = () => {
  return (
    <>
      <NextSeo
        title="Tushar Gautam -About Page | Portfolio  Full Stack Developer"
        description="Tushar Gautam, About Me Want to Know About Me from Here, A Tech Geek And Full stack Developer"
      />
      <main className="flex-1  text-white lg:max-w-7xl mx-auto max-w-3xl md:px-16 px-6">
        <section className="grid lg:grid-cols-2 grid-cols-1 gap-x-6 justify-items-center">
          <div className="order-2 lg:order-none">
            <h1 className="lg:text-5xl text-4xl lg:leading-tight basis-1/2 font-bold mb-8">
              I'm <span className="text-purple-400">Tushar</span>. I live in
              Bharat (<span className="text-purple-400"> भारत </span>), where I
              design the <span className="text-purple-400">Future</span>.
            </h1>

            <div className="flex flex-col lg:justify-self-center justify-self-start gap-y-8 lg:order-1 order-none mb-12">
              <p>
                I find joy in sharing my knowledge and insights through
                carefully crafted articles. Some of my Ideas has been featured
                in popular blogs and newsletters.
              </p>
              <p>
                I'm also a firm believer in the power of community and
                collaboration. You might spot me at local tech meetups, eagerly
                engaging in discussions and exchanging ideas with fellow
                developers. I thrive on the energy of these interactions and
                value the connections formed within our vibrant tech ecosystem.
              </p>
              <p>
                In my spare time, when I'm not knee-deep in code or sharing my
                knowledge, you'll find me indulging in a variety of creative
                pursuits. Whether it's in locale gym, experimenting with body,
                or getting lost in a captivating book, I believe in nurturing a
                well-rounded life outside of the digital realm.
              </p>
              <p className="text-green-500">
                If you ever spot me in the wild, don't hesitate to say hello!
                Let's grab a cup of Chai and geek out over the latest
                advancements in front-end development or discuss our favorite
                obscure programming languages.
              </p>
              <p className="text-green-400">
                यदि आप कभी मुझे देखें, तो मिलने कहने में हिचकिचाएं नहीं! आइए एक
                कप चाय लेते हैं और विकास में होने वाली नवीनतम प्रगतियों पर या
                हमारी पसंदीदा असामान्य प्रोग्रामिंग भाषाओं पर बात करते हैं।
              </p>
              <p className="text-green-300">
                ਜੇ ਤੁਸੀਂ ਕਦੇ ਵੀ ਮੇਰੇ ਨੂੰ ਜਿੰਦੇ 'ਚ ਦੇਖੋ, ਤਾਂ ਇਹ ਨਾਨਾ ਨਾ ਕਹੋ! ਆਓ
                ਇੱਕ ਕੱਪ ਚਾ ਪੀਣਾ ਤੇ ਫਰੰਟ-ਇੰਡ ਡਵੈਲਪਮੈਂਟ ਵਿੱਚ ਹੋਰਾਂ ਦੇ ਨਵੀਨਤਮ
                ਪਰਗਟੀਆਂ ਉੱਤੇ ਜੀਕ ਆਉਣ ਜਾਂ ਸਾਡੀਆਂ ਪਸੰਦੀਦਾ ਅਜੂਬਦੁਨ ਪ੍ਰੋਗਰਾਮਿੰਗ
                ਭਾਸ਼ਾਵਾਂ 'ਤੇ ਗੱਲਬਾਤ ਕਰੀਏ।
              </p>
            </div>
          </div>
          <div>
            <Image
              className="rounded-3xl mb-4 object-cover max-h-96 min-h-96 bg-top bg-[#1d1d20]"
              src="/Tushar.jpg"
              alt="profile"
              width={400}
              height={400}
              quality={100}
            />
            <Link
              href="/"
              className="flex items-center justify-center gap-x-2 bg-[!1d1d20] border border-transparent hover:border-zinc-700 rounded-md duration-300 py-2 text-center cursor-grabbing font-medium"
            >
              <p className="text-base mt-2">Download Resume</p>
            </Link>

            <ul className="">
              <li>
                <Link
                  href="mailto:gautams4code@gmail.com?subject=Redirected%20From%20Portfolio"
                  className="mt-10 flex items-center gap-x-2 hover:text-purple-400 duration-300 text-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  gautams4code@gmail.com
                </Link>
              </li>
            </ul>
          </div>
        </section>
        <section className="mt-24 max-w-2xl">
          <h2 className="font-semibold text-4xl mb-4">Expertise</h2>
          <p className="text-zinc-400 max-w-lg">
            I&apos;ve spent few years working on my skills . In no particular
            order, here are a few of them.
          </p>

          <ul className="flex flex-wrap items-center gap-3 mt-8">
            <li className="glass-btn">Next.js</li>
            <li className="glass-btn">JavaScript</li>
            <li className="glass-btn">TypeScript</li>
            <li className="glass-btn">C++</li>
            <li className="glass-btn">C</li>
            <li className="glass-btn">HTML</li>
            <li className="glass-btn">CSS</li>
            <li className="glass-btn">React</li>
            <li className="glass-btn">MongoDb</li>
            <li className="glass-btn">Node.js</li>
            <li className="glass-btn">Github</li>
            <li className="glass-btn">Java</li>
          </ul>
        </section>
      </main>
    </>
  );
};

export default page;
