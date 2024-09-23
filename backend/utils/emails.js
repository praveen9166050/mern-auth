import { mailtrapClient, sender } from "../configs/mailtrap.js";
import { verificationEmailTemplate } from "./emailTemlplates.js";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationMail = async (email, verificationToken) => {
  const recipient = [{email: process.env.RECIPIENT_EMAIL || email}];
  const response = await mailtrapClient.send({
    from: sender,
    to: recipient,
    subject: "Verify your email",
    html: verificationEmailTemplate(verificationToken),
    category: "Email Verification"
  });
  console.log("Verification email sent successfully", response);
}

export const sendWelcomeMail = async (email, name) => {
  const recipient = [{email: process.env.RECIPIENT_EMAIL || email}];
  const response = await mailtrapClient.send({
    from: sender,
    to: recipient,
    template_uuid: process.env.WELCOME_MAIL_TEMPLATE_UUID,
    template_variables: {
      "company_info_name": process.env.WELCOME_MAIL_COMPANY_NAME,
      "name": name
    }
  });
  console.log("Welcome email sent successfully", response);
}