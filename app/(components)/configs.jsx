import nodemailer from "nodemailer";

const email = process.env.nm_mail;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass: process.env.nm_psswd,
  },
});

export const mailOptions = {
  from: email,
  to: "gautams4mailreciever@gmail.com",
};

const emailGenerator = (data) => {
  const stringData = Object.entries(data).reduce((str, [key, val]) => {
    str += `${CONTACT_MESSAGE_FIELDS[key]}: \n${val} \n\n`;
  }, "");
};
