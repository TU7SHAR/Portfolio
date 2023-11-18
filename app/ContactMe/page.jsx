"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import mailSvg from "../../public/mail.svg";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [mail, setmail] = useState("");
  const [name, setname] = useState("");
  const [subject, setsubject] = useState("");
  const [mailBody, setmailBody] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log(session);
    console.log(status);
    if (status === "authenticated") {
      setmail(session.user.email);
    } else if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/ContactMe");
    }
  }, [session, status]);

  const handleName = (event) => {
    let value = event.target.value;
    setname(value);
  };

  const handleSubject = (event) => {
    let value = event.target.value;
    setsubject(value);
  };

  const handleMailBody = (event) => {
    let value = event.target.value;
    setmailBody(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch("/api/auth/ContactData", {
      method: "POST",
      body: JSON.stringify({
        mail: mail,
        subject: subject,
        name: name,
        mailBody: mailBody,
      }),
      "content-type": "application/json",
    });
    if (res.ok) {
      router.push("/ContactMe/Form?form=success");
    } else {
      router.push("/ContactMe/Form?form=fail");
    }
  };

  let btnEnabled = !(!mail || !name || !subject || !mailBody);

  return (
    <>
      <div className="card lg:card-side bg-base-100 border text-white border-purple-400 shadow-xl p-1 mx-11">
        <figure>
          <Image src={mailSvg} width={100} height={100} />
        </figure>
        <div className="card-body">
          <h2 className="card-title flex items-center justify-center text-purple-400">
            Get In Touch
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col w-[100%]">
            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered border-purple-400 my-3 input-accent focus:outline-none"
              onChange={handleName}
              value={name}
            />
            <input
              type="email"
              readOnly
              value={mail}
              className="input cursor-none text-white input-bordered input-accent w-full border-purple-400 mb-3 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={handleSubject}
              className=" focus:outline-none input input-bordered border-purple-400 mb-3 input-accent "
            />
            <textarea
              className="textarea border-purple-400 focus:outline-none mb-3"
              placeholder="Bio"
              rows={8}
              value={mailBody}
              onChange={handleMailBody}
            ></textarea>
          </form>
          <div className="card-actions justify-end">
            <button
              className="btn border border-purple-400 bg-purple-400 text-xl flex items-center justify-center duration-300"
              disabled={!btnEnabled}
              style={{ display: btnEnabled ? "flex" : "none" }}
              onClick={handleSubmit}
            >
              <p>Send</p>{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
