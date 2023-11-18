import { NextResponse } from "next/server";
import { mailOptions, transporter } from "../../../(components)/configs.jsx";

export async function POST(req, res) {
  try {
    const { name, mail, subject, mailBody } = await req.json();
    const data = { name, mail, subject, mailBody };

    if (!data.name || !data.mail || !data.subject || !data.mailBody) {
      return NextResponse.json(
        { msg: "Required Fields are Missing!!" },
        { status: 400 }
      );
    }

    transporter.sendMail({
      ...mailOptions,
      subject: data.subject,
      text: "test text",
      html: `<h1>From :${name}</h1><h3>From Mail Address: ${mail}</h3><p>Query: ${mailBody}</p>`,
    });

    return NextResponse.json({ msg: "Sent Success" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ err: error }, { status: 404 });
  }
}
