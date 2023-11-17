import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const { name, mail, subject, mailBody } = await req.json();
    const data = { name, mail, subject, mailBody };
    console.log(data);
    return NextResponse.json(
      { msgReview: "Got Data", msg: data },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: error }, { status: 404 });
  }
}
