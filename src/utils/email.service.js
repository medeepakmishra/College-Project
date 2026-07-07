import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  const { data, error } = await resend.emails.send({
    from: "Placement Cell <onboarding@resend.dev>",
    to: [email],
    subject: "Email Verification OTP",

    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>College Placement Portal</h2>

        <p>Your verification OTP is:</p>

        <h1>${otp}</h1>

        <p>This OTP is valid for 10 minutes.</p>

        <p>If you did not request this OTP, ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend Email Error:", error);
    throw new Error(error.message);
  }

  return data;
};