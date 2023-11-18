import { NextSeo } from "next-seo";
import Link from "next/link";

const Fail = () => {
  return (
    <>
      <NextSeo
        title="Tushar Gautam - Unfortunater | Unsuccessfull Query "
        description="Tushar Gautam -Query Unsuccesfull Message Display For Portfolio"
      />
      <div className="flex flex-col justify-center lg:text-3xl font-medium lg:my-8 my-4 cursor-pointer text-xl w-full items-center">
        <p className="flex items-center">
          UnFortunately Your Query was UnSuccessful
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-red-500 mx-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          .
        </p>
        <p>You Can try again,</p>
      </div>
      <div className="card-actions justify-between">
        <div></div>
        <Link href="/ContactMe" className="btn btn-primary normal-case text-xl">
          Back to ContactForm
        </Link>
      </div>
    </>
  );
};

export default Fail;
