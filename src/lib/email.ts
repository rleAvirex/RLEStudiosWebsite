import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_ADDRESS =
  process.env.MAIL_FROM || 'RLE Studios <onboarding@resend.dev>'

export function isEmailConfigured(): boolean {
  return resend !== null
}

interface SendMagicCodeArgs {
  to: string
  code: string
}

/**
 * Sends the magic login code via Resend.
 * Returns true if the email was sent (or skipped in dev), false on failure.
 */
export async function sendMagicCodeEmail({ to, code }: SendMagicCodeArgs): Promise<boolean> {
  if (!resend) {
    // No API key configured — callers should fall back to dev display.
    return false
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to,
      subject: `Your RLE Studios login code: ${code}`,
      html: renderMagicCodeEmail(code),
      text: `Your RLE Studios login code is ${code}. It expires in 10 minutes.`,
    })

    return !error
  } catch {
    return false
  }
}

function renderMagicCodeEmail(code: string): string {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#0a0a0a;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:420px;background:#141414;border:1px solid #262626;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:32px 32px 8px 32px;">
                <h1 style="margin:0 0 4px 0;color:#fafafa;font-size:20px;font-weight:700;">RLE Studios</h1>
                <p style="margin:0;color:#a3a3a3;font-size:14px;">Use the code below to sign in to your account.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px;" align="center">
                <div style="display:inline-block;background:#1f1f1f;border:1px solid #2a2a2a;border-radius:12px;padding:16px 40px;">
                  <span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:36px;font-weight:700;letter-spacing:0.3em;color:#fafafa;">${code}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px 32px;">
                <p style="margin:0;color:#737373;font-size:13px;line-height:1.5;">
                  This code expires in 10 minutes. If you didn't request it, you can safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0 0;color:#525252;font-size:12px;">&copy; ${new Date().getFullYear()} RLE Studios</p>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim()
}
