import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@uniflexlogistics.com'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function emailWrapper(content: string) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Uniflex Global Logistics</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f7;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f0f4f7">
    <tr>
      <td align="center" style="padding:40px 16px">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
               style="max-width:600px;width:100%">

          <!-- Header -->
          <tr>
            <td style="background:#0a1520;border-radius:16px 16px 0 0;padding:28px 32px">
              <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.3px">
                Uniflex<span style="color:#29c4d9">·</span>Logistics
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;text-align:center">
              <p style="font-size:12px;color:#a0b8c4;margin:0">
                Uniflex Global Logistics — internal dispatch notification
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

interface LogisticsLeadParams {
  name: string
  phone: string
  email: string
  truckType: string
  route?: string
  message?: string
}

// PLACEHOLDER recipient — set LOGISTICS_LEAD_EMAIL in env before launch
const LOGISTICS_LEAD_TO = process.env.LOGISTICS_LEAD_EMAIL ?? 'dispatch@uniflexlogistics.com'

export async function sendLogisticsLeadEmail(lead: LogisticsLeadParams) {
  const name = escapeHtml(lead.name)
  const phone = escapeHtml(lead.phone)
  const email = escapeHtml(lead.email)
  const truckType = escapeHtml(lead.truckType)
  const route = lead.route ? escapeHtml(lead.route) : undefined
  const message = lead.message ? escapeHtml(lead.message) : undefined

  await resend.emails.send({
    from: FROM,
    to: LOGISTICS_LEAD_TO,
    replyTo: lead.email,
    subject: `New quote request — ${name} (${truckType})`,
    html: emailWrapper(`
      <p style="font-size:24px;font-weight:700;color:#0d1f2d;margin:0 0 20px">New logistics lead</p>
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
             style="background:#f8fafb;border-radius:10px;padding:4px 20px">
        <tr><td style="padding:12px 0;border-bottom:1px solid #eef3f6;font-size:13px;color:#5d7d8e;width:120px">Name</td>
            <td style="padding:12px 0;border-bottom:1px solid #eef3f6;font-size:14px;font-weight:600;color:#0d1f2d">${name}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid #eef3f6;font-size:13px;color:#5d7d8e">Phone</td>
            <td style="padding:12px 0;border-bottom:1px solid #eef3f6;font-size:14px;font-weight:600;color:#0d1f2d">${phone}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid #eef3f6;font-size:13px;color:#5d7d8e">Email</td>
            <td style="padding:12px 0;border-bottom:1px solid #eef3f6;font-size:14px;font-weight:600;color:#0d1f2d">${email}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid #eef3f6;font-size:13px;color:#5d7d8e">Truck type</td>
            <td style="padding:12px 0;border-bottom:1px solid #eef3f6;font-size:14px;font-weight:600;color:#0d1f2d">${truckType}</td></tr>
        ${route ? `
        <tr><td style="padding:12px 0;border-bottom:1px solid #eef3f6;font-size:13px;color:#5d7d8e">Home base / lanes</td>
            <td style="padding:12px 0;border-bottom:1px solid #eef3f6;font-size:14px;font-weight:600;color:#0d1f2d">${route}</td></tr>` : ''}
        ${message ? `
        <tr><td style="padding:12px 0;font-size:13px;color:#5d7d8e;vertical-align:top">Message</td>
            <td style="padding:12px 0;font-size:14px;color:#0d1f2d">${message}</td></tr>` : ''}
      </table>
      <p style="color:#a0b8c4;font-size:12px;margin:24px 0 0">
        Submitted via the quote form — reply directly to this email to respond to ${name}.
      </p>
    `),
  })
}
