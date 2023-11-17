"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const UserForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [psswd, setPsswd] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleName = async (events) => {
    const value = await events.target.value;
    await setName(value);
  };

  const handlePsswd = async (events) => {
    const value = await events.target.value;
    await setPsswd(value);
  };

  const handleSubmit = async (events) => {
    events.preventDefault();
    setErrorMessage("");

    const res = await fetch("/api/Users", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        psswd: psswd,
      }),
      "content-type": "application/json",
    });

    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      router.refresh();
      router.push("/");
    }
  };
  return (
    <>
      <h2 className="card-title flex justify-center md:text-5xl text-2xl  font-bold text-purple-400">
        Login Form
      </h2>
      <form onSubmit={handleSubmit} method="POST">
        <div className="my-3">
          <input
            type="text"
            placeholder="Username "
            onChange={handleName}
            required={true}
            value={name}
            className="input input-bordered border-purple-400 focus:outline-none w-full max-w-xs"
          />
        </div>

        <div className="my-2">
          <input
            type="text"
            placeholder="Password "
            required={true}
            value={psswd}
            onChange={handlePsswd}
            className="input input-bordered border-purple-400 focus:outline-none w-full max-w-xs"
          />
        </div>
        <div className="card-actions justify-center border-b border-spacing-3 border-zinc-800 mb-4">
          <input
            type="submit"
            value="Create User"
            onClick={handleSubmit}
            className="border my-3 p-2 rounded-lg border-green-400 text-green-400 hover:bg-green-600 hover:text-white hover:border-none  duration-300 cursor-pointer"
          />
        </div>

        <div className="my-2 ">
          <ul className="border-purple-400 text-center py-1 border hover:border-none hover:bg-white hover:text-purple-400 duration-300 rounded-full">
            <li>
              <Link href="/api/auth/signin?callbackUrl=/Details">
                Login Using Google
              </Link>
            </li>
          </ul>
        </div>

        <div className=" mt-1 flex items-end">
          <p className="flex items-end font-mono text-sm">
            Not A User No Worries?&nbsp;
            <Link
              href="/Form?Form=Registration"
              className=" text-purple-400 text-sm"
            >
              Register Here
            </Link>
          </p>
        </div>
        <div className="">
          <p className=" text-red-500 items-end flex">
            {errorMessage !== "" ? `*${errorMessage}!` : ""}
          </p>
        </div>
      </form>
    </>
  );
};
export default UserForm;
