import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../(models)/User.jsx";
import { dbConnect } from "../../lib/db.js";

export async function POST(req) {
  try {
    const { name, psswd } = await req.json();

    if (!name || !psswd) {
      return NextResponse.json({ msg: "Empty Fields" }, { status: 400 });
    }
    if (!process.env.jwt_secret) {
      return NextResponse.json({ msg: "Login is not configured" }, { status: 503 });
    }

    await dbConnect();
    const userFound = await User.findOne({ username: name });

    // Previously the password was compared against itself in an ignored
    // callback, so a token was issued for ANY existing username.
    const valid = userFound && (await bcrypt.compare(psswd, userFound.password || ""));
    if (!valid) {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 401 });
    }

    const session = jwt.sign({ userId: userFound._id }, process.env.jwt_secret, {
      expiresIn: "7d",
    });

    return NextResponse.json(
      {
        msg: "User Found Succcess",
        email: userFound.email,
        name: userFound.username,
        role: "Manual User",
        session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Error While Logging" }, { status: 500 });
  }
}
