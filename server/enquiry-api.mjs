import http from 'node:http';
import nodemailer from '/var/www/voya-vendor-platform/activity-saas-backend/node_modules/nodemailer/dist/esm/nodemailer.js';

const port = Number(process.env.ENQUIRY_API_PORT || 4101);
const allowedOrigin = process.env.ENQUIRY_ALLOWED_ORIGIN || 'https://demo.dhisoft.in';
const recipient = process.env.ENQUIRY_TO_EMAIL;

const json = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  });
  res.end(JSON.stringify(body));
};

const readBody = req => new Promise((resolve, reject) => {
  let raw = '';
  req.on('data', chunk => {
    raw += chunk;
    if (raw.length > 32768) reject(new Error('payload-too-large'));
  });
  req.on('end', () => {
    try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('invalid-json')); }
  });
  req.on('error', reject);
});

const clean = value => String(value ?? '').trim().slice(0, 2000);
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] ?? character));
const serviceLabel = value => String(value || 'Not specified').replaceAll('-', ' ').replace(/\b\w/g, character => character.toUpperCase());

const renderEnquiryHtml = ({ name, phone, email, city, service, date, message }) => {
  const logoUrl = 'https://demo.dhisoft.in/ywc/assets/logo-transparent.png';
  const row = (label, value) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #dce9ee;color:#587080;font-size:13px;width:38%;">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #dce9ee;color:#0b1c3d;font-size:14px;font-weight:700;">${escapeHtml(value || 'Not provided')}</td></tr>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="color-scheme" content="light"><title>New YWC enquiry</title></head>
<body style="margin:0;background:#eef8f5;font-family:Arial,Helvetica,sans-serif;color:#0b1c3d;">
  <div style="padding:28px 12px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #dce9ee;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:22px 30px;background:#0b1c3d;"><table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="vertical-align:middle;"><img src="${logoUrl}" width="104" alt="Yes We Care" style="display:block;width:104px;height:auto;max-height:48px;object-fit:contain;"></td><td style="padding-left:14px;vertical-align:middle;"><div style="font-size:19px;font-weight:800;letter-spacing:.2px;color:#fff;">Yes We Care</div><div style="margin-top:3px;font-size:10px;letter-spacing:1.4px;color:#b8c9d7;">CARE BEYOND JUST TREATMENT</div></td></tr></table></td></tr>
      <tr><td style="height:6px;background:#168244;font-size:0;line-height:0;">&nbsp;</td></tr>
      <tr><td style="padding:30px 30px 24px;"><div style="font-size:11px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;color:#158478;margin-bottom:10px;">NEW ENQUIRY RECEIVED</div><h1 style="margin:0 0 14px;color:#0b1c3d;font-size:27px;line-height:1.25;">A new care enquiry needs your attention</h1><p style="margin:0;color:#52657c;font-size:15px;line-height:1.6;">Someone has submitted a request through the YWC website. Please review the details below and contact them to discuss suitable support.</p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0 20px;border:1px solid #dce9ee;border-radius:12px;background:#f8fcfd;overflow:hidden;">${row('Full name', name)}${row('Phone number', phone)}${row('Email address', email)}${row('City / location', city)}${row('Service required', serviceLabel(service))}${row('Preferred date', date)}</table>
        <div style="margin:0 0 20px;padding:16px 18px;border-left:4px solid #168244;background:#eaf8f1;color:#40586b;font-size:15px;line-height:1.6;"><strong style="display:block;margin-bottom:6px;color:#0b1c3d;">Requirement</strong>${escapeHtml(message).replaceAll('\n', '<br>')}</div>
        <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="border-radius:24px;background:#168244;"><a href="https://demo.dhisoft.in/ywc/request-assistance.html" style="display:inline-block;padding:12px 22px;border-radius:24px;color:#fff;font-size:14px;font-weight:800;text-decoration:none;">Open YWC website&nbsp; →</a></td></tr></table>
      </td></tr>
      <tr><td style="padding:18px 30px;border-top:1px solid #e4eef0;background:#f6fbfd;color:#718392;font-size:12px;line-height:1.55;"><strong style="color:#0b1c3d;">Yes We Care</strong><br>Submitted from <a href="https://demo.dhisoft.in/ywc/" style="color:#168244;text-decoration:none;">demo.dhisoft.in/ywc</a>. Please treat this enquiry as a request for coordination, not a confirmed booking.</td></tr>
    </table>
  </div>
</body></html>`;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
});

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return json(res, 204, {});
  if (req.method === 'GET' && req.url === '/health') return json(res, 200, { ok: true });
  if (req.method !== 'POST' || req.url !== '/enquiry') return json(res, 404, { error: 'not-found' });

  try {
    const body = await readBody(req);
    const name = clean(body.name);
    const phone = clean(body.phone);
    const email = clean(body.email);
    const city = clean(body.city);
    const service = clean(body.service);
    const date = clean(body.date);
    const message = clean(body.message);
    if (!name || !phone || !city || !service || !message || body.consent !== true) {
      return json(res, 400, { error: 'required-fields' });
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return json(res, 400, { error: 'invalid-email' });

    const text = [
      'New YWC website enquiry',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email || 'Not provided'}`,
      `City / Location: ${city}`,
      `Service: ${serviceLabel(service)}`,
      `Preferred date: ${date || 'Not specified'}`,
      '',
      'Requirement:',
      message
    ].join('\n');

    await transporter.sendMail({
      from: `${process.env.SMTP_FROM_NAME || 'Yes We Care'} <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: email || undefined,
      subject: `YWC enquiry — ${service}`,
      text,
      html: renderEnquiryHtml({ name, phone, email, city, service, date, message })
    });
    return json(res, 200, { ok: true });
  } catch (error) {
    if (error?.message === 'payload-too-large' || error?.message === 'invalid-json') return json(res, 400, { error: 'invalid-request' });
    console.error('YWC enquiry delivery failed:', error?.message || error);
    return json(res, 502, { error: 'delivery-failed' });
  }
});

server.listen(port, '127.0.0.1', () => console.log(`YWC enquiry API listening on 127.0.0.1:${port}`));
