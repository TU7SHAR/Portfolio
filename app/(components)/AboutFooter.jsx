import Image from "next/image";
import Link from "next/link";

const AboutFooter = () => {
  return (
    <>
      <section className="max-w-[100vw] mt-32">
        <div>
          <h2 className="font-semibold text-4xl mb-4">
            Educational Experience
          </h2>
        </div>
        <div>
          <div className="flex items-start lg:gap-x-6 gap-x-4 max-w-2xl relative before:absolute mt-4 before:bottom-0 before:top-[4.5rem] before:left-7 before:w-[1px] before:h-[calc(100%-50px)] before:bg-zinc-800">
            <Link
              href="/"
              rel="noreferrer noopener"
              className="min-h-[60px] min-w-[60px] rounded-md overflow-clip relative"
            >
              <Image
                src="/orange.png"
                className="object-cover"
                alt="img"
                fill
              />
            </Link>
            <div className="flex flex-col items-start">
              <h3 className="text-xl font-bold flex items-center ">
                CBSE Schooling{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7 text-[#FF916B] ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
              </h3>
              <p>Student</p>
              <small className="text-sm text-zinc-500 mt-2 tracking-widest uppercase">
                2004-03-01 - 2020-04-01
              </small>
              <p className="text-base text-zinc-400 my-4">
                If you set your goals ridiculously high and it&apos;s a failure,
                you will fail above everyone else
              </p>
            </div>
          </div>
        </div>{" "}
        <div>
          <div className="flex items-start lg:gap-x-6 gap-x-4 max-w-2xl relative before:absolute before:bottom-0 before:top-[4.5rem] before:left-7 before:w-[1px] before:h-[calc(100%-50px)] before:bg-zinc-800">
            <Link
              href="/"
              rel="noreferrer noopener"
              className="min-h-[60px] min-w-[60px] rounded-md overflow-clip relative"
            >
              <Image src="/red.png" className="object-cover" alt="img" fill />
            </Link>
            <div className="flex flex-col items-start">
              <h3 className="text-xl font-bold flex items-center">
                Corona Period{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7 ml-1 text-[#A52A2B]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </h3>
              <p>Hard Time</p>
              <small className="text-sm text-zinc-500 mt-2 tracking-widest uppercase">
                2020-04-01 - 2021-10-01
              </small>
              <p className="text-base text-zinc-400 my-4">
                In life&apos;s dance, hardships are steps that teach. Approach
                challenges with the playfulness of a child, for even in the
                toughest moments, and uncover most valuable lessons.
              </p>
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex items-start lg:gap-x-6 gap-x-4 max-w-2xl relative before:absolute before:bottom-0 before:top-[4.5rem] before:left-7 before:w-[1px] before:h-[calc(100%-50px)] before:bg-zinc-800">
            <Link
              href="/"
              rel="noreferrer noopener"
              className="min-h-[60px] min-w-[60px] rounded-md overflow-clip relative"
            >
              <Image src="/blue.png" className="object-cover" alt="img" fill />
            </Link>
            <div className="flex flex-col items-start">
              <h3 className="text-xl font-bold flex items-center">
                Diploma{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7 text-[#77CCFD] ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
              </h3>
              <p>Basic Programming Languages</p>
              <small className="text-sm text-zinc-500 mt-2 tracking-widest uppercase">
                2021-10-01 - 2022-05-01
              </small>
              <p className="text-base text-zinc-400 my-4">
                Don&apos;t be distracted by criticism. Remember — the only taste
                of success some people get is to take a bite out of you
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-start lg:gap-x-6 gap-x-4 max-w-2xl relative before:absolute before:bottom-0 before:top-[4.5rem] before:left-7 before:w-[1px] before:h-[calc(100%-50px)] before:bg-zinc-800">
            <Link
              href="/"
              rel="noreferrer noopener"
              className="min-h-[60px] min-w-[60px] rounded-md overflow-clip relative"
            >
              <Image src="/green.png" className="object-cover" alt="img" fill />
            </Link>
            <div className="flex flex-col items-start">
              <h3 className="text-xl font-bold flex items-center">
                Degree
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7 text-[#54EFB8] ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
              </h3>
              <p>Computer Science</p>
              <small className="text-sm text-zinc-500 mt-2 tracking-widest uppercase">
                2020-12-12
              </small>
              <p className="text-base text-zinc-400 my-4">
                Many of life&apos;s failures are people who did not realize how
                close they were to success when they gave up
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutFooter;
