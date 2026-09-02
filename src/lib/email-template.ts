import { Resend } from "resend";

export async function sendVerificationRequest(params: any) {
  const { identifier, url, provider } = params;
  const resend = new Resend(process.env.AUTH_RESEND_KEY);

  const { host } = new URL(url);

  try {
    const result = await resend.emails.send({
      from: provider.from,
      to: identifier,
      subject: `Sign in to EterVerse`,
      text: text({ url, host }),
      html: html({ url, host }),
    });
    
    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    throw new Error(`Failed to send verification email.`);
  }
}

/**
 * Email HTML body
 */
function html({ url, host }: { url: string; host: string }) {
  const brandColor = "#22D3EE"; // Eter-Cyan
  const backgroundColor = "#050505"; // Obsidian Black
  const textColor = "#e4e4e7"; // Zinc 200

  return `
<body style="background-color: ${backgroundColor}; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${backgroundColor}; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #09090b; border: 1px solid #27272a; border-radius: 8px; padding: 40px;">
          
          <!-- Header / Logo Area -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <div style="font-size: 24px; font-weight: bold; color: #f8fafc; letter-spacing: -0.5px;">EterVerse<span style="color: ${brandColor}">.</span></div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <h2 style="font-size: 20px; font-weight: 600; color: #f8fafc; margin: 0 0 10px 0;">Welcome back!</h2>
              <p style="font-size: 15px; line-height: 24px; color: ${textColor}; margin: 0;">
                Click the button below to securely sign in to your EterVerse account.
              </p>
            </td>
          </tr>
          
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 4px;" bgcolor="${brandColor}">
                    <a href="${url}" target="_blank" style="font-size: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #000000; text-decoration: none; border-radius: 4px; padding: 14px 28px; border: 1px solid ${brandColor}; display: inline-block; box-shadow: 0 0 15px rgba(34,211,238,0.3);">
                      Log in to EterVerse
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="border-top: 1px solid #27272a; padding-top: 24px;">
              <p style="font-size: 12px; line-height: 18px; color: #71717a; margin: 0;">
                If you did not request this email you can safely ignore it.
                <br>This secure link will expire in 24 hours.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
`;
}

/**
 * Email Text body (fallback for email clients that don't render HTML)
 */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to EterVerse\n${url}\n\n`;
}
