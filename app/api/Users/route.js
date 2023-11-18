import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "../../(models)/User.jsx";
export async function POST(req) {
  try {
    const { username, email, password } = await req.json();
    const userData = { username, email, password };

    //confirms data exsists
    if (!userData.email || !userData.password || !userData.username) {
      return NextResponse.json(
        {
          message: "All Fields are Required!",
        },
        { status: 400 }
      );
    }

    //check for exsisiting Mail
    const duplicateMail = await User.findOne({ email: userData.email })
      .lean()
      .exec();

    if (duplicateMail) {
      return NextResponse.json({ msg: "Duplicate Email" }, { status: 409 });
    }

    const duplicateUser = await User.findOne({ username: userData.username });
    if (duplicateUser) {
      return NextResponse.json({ msg: "Duplicate Name" }, { status: 409 });
    }

    const hashPsswd = await bcrypt.hash(userData.password, 12);
    userData.password = hashPsswd;

    await User.create(userData);
    return NextResponse.json({ msg: "User Created." }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Error", err }, { status: 500 });
  }
}
