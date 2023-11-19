import Link from "next/link";

const Success = () => {
  return (
    <>
      {" "}
      <NextSeo
        title="Tushar Gautam - Contact Form"
        description="To Get in Touch with me Fill this amazingly designed form, Awaiting Your response"
      />
      <NextSeo
        title="Tushar Gautam - fortunately | successfull Query "
        description="Tushar Gautam -Query Succesfull Message Display For Portfolio"
      />
      <div className="flex flex-col justify-center lg:text-3xl font-medium lg:my-8 my-4 cursor-pointer text-xl w-full items-center">
        <p className="flex items-center">
          Your Query is sent Successfully
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 text-green-500 mx-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
          .{" "}
        </p>
        <p>You will get reply within 3 working days..</p>
      </div>
      <div className="card-actions justify-between">
        <div></div>
        <Link href="/" className="btn btn-primary normal-case text-xl">
          Back to Main Page
        </Link>
      </div>
    </>
  );
};

export default Success;
