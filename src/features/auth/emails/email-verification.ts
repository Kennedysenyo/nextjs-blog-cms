"use server";

import EmailVerification from "@/components/emails/email-verification";
import { resend } from "@/lib/resend/resend";

export async function sendEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const domain = process.env.BASE_URL;
  if (!domain) {
    throw new Error("BASE_URL is required to send email!");
  }

  await resend.emails.send({
    from: "Websendor <noreply@websendor.com>",
    to,
    subject,
    react: EmailVerification({ email: to, text }),
  });
}
