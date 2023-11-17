import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "../../(models)/User.jsx";
export async function POST(req) {
  try {
    const { name, mail, psswd } = await req.json();
    const userData = { name, mail, psswd };

    //confirms data exsists
    if (!userData.mail || !userData.psswd || !userData.name) {
      return NextResponse.json(
        {
          message: "All Fields are Required!",
        },
        { status: 400 }
      );
    }

    //check for exsisiting Mail
    const duplicateMail = await User.findOne({ mail: userData.mail })
      .lean()
      .exec();

    if (duplicateMail) {
      return NextResponse.json({ msg: "Duplicate Email" }, { status: 409 });
    }

    const duplicateUser = await User.findOne({ name: userData.name });
    if (duplicateUser) {
      return NextResponse.json({ msg: "Duplicate Name" }, { status: 409 });
    }

    const hashPsswd = await bcrypt.hash(userData.psswd, 12);
    userData.psswd = hashPsswd;

    await User.create(userData);
    return NextResponse.json({ msg: "User Created." }, { status: 201 });
  } catch (err) {
    console.log(res);
    return NextResponse.json({ msg: "Error", err }, { status: 500 });
  }
}
