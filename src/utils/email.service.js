import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Placement Cell <onboarding@resend.dev>",

      // Single recipient as string
      to: to,

      subject: subject,

      html: html,
    });

    if (error) {
      console.error("Resend Email Error:", error);

      throw new Error(
        error.message || "Email sending failed"
      );
    }

    console.log("Email sent successfully:", data);

    return data;

  } catch (error) {
    console.error(
      "Email Service Error:",
      error.message
    );

    throw error;
  }
};