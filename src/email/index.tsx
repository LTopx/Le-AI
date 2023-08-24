import { createTransport } from "nodemailer";
import { render } from "@react-email/render";
import Email from "./email";
import { SendVerificationRequestParams } from "next-auth/providers";

export async function sendVerificationRequest(
  params: SendVerificationRequestParams
) {
  const { identifier, url, provider } = params;
  const { host } = new URL(url);
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to Le-AI`,
    text: text({ url, host }),
    html: render(<Email url={url} />),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
  }
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to Le-AI ${host}\n${url}\n\n`;
}
