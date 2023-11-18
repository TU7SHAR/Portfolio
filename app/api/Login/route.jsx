import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "../../(models)/User.jsx";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { name, psswd } = await req.json();
    const userData = { name, psswd };

    if (!userData.name || !userData.psswd) {
      return NextResponse.json({ msg: "Empty Fields" }, { status: 404 });
    }

    const userFound = await User.findOne({ name: name });
    let mail = "Unreal Mail";

    if (userFound) {
      bcrypt.compare(psswd, userData.psswd, (err, res) => {
        if (err) return NextResponse.json({ msg: err }, { status: 400 });
        if (!res)
          return NextResponse.json(
            { msg: "Invalid Password" },
            { status: 402 }
          );
      });
    }
    const session = jwt.sign({ userId: userFound._id }, process.env.jwt_secret);

    return NextResponse.json(
      {
        msg: "User Found Succcess",
        email: userFound.mail,
        name: name,
        role: "Manual User",
        session: session,
      },
      { status: 202 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: error, msgReview: "Error While Logging" });
  }
}
