// import nodemailer from "nodemailer";

// console.log(
//   "Email user loaded:",
//   !!process.env.EMAIL_USER
// );

// console.log(
//   "Email password loaded:",
//   !!process.env.EMAIL_PASS
// );

// const transporter = nodemailer.createTransport({
//   service: "gmail",

//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export default transporter;


import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: "./.env" });

console.log("Email user loaded:", !!process.env.EMAIL_USER);
console.log("Email password loaded:", !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default transporter;