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

  const handleMail = async (events) => {
    const value = await events.target.value;
    await setMail(value);
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
        mail: mail,
        psswd: psswd,
      }),
      "content-type": "application/json",
    });

    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.msg);
    } else {
      router.refresh();
      router.push("/Form?Form=Login");
    }
  };
  return (
    <>
      <h2 className="card-title flex justify-center md:text-5xl text-2xl  font-bold text-purple-400">
        Registration <span className="res"> Form </span>
      </h2>
      <form onSubmit={handleSubmit} method="POST">
        <div className="my-2">
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
            placeholder="Mail"
            onChange={handleMail}
            required={true}
            value={mail}
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
        <div className="card-actions justify-center">
          <input
            type="submit"
            value="Create User"
            onClick={handleSubmit}
            className="border my-3 p-2 rounded-lg border-green-400 text-green-400 hover:bg-green-600 hover:text-white  duration-300 cursor-pointer"
          />
        </div>
        <div className="mt-2 flex items-center">
          <p className="flex items-center font-mono text-sm">
            Not A User? <span className="res"> &nbsp;No Worries </span>&nbsp;
            <Link href="/Form?Form=Login" className=" text-purple-400 text-sm">
              Login <span className="res"> Here </span>
            </Link>
          </p>
        </div>
        <div className="">
          <p className=" text-red-500 items-end flex">
            {errorMessage !== "" ? `*${errorMessage} error` : ""}
          </p>
        </div>
      </form>
    </>
  );
};
export default UserForm;
