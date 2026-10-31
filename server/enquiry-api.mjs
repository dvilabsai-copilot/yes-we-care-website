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
      `Service: ${service}`,
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
      text
    });
    return json(res, 200, { ok: true });
  } catch (error) {
    if (error?.message === 'payload-too-large' || error?.message === 'invalid-json') return json(res, 400, { error: 'invalid-request' });
    console.error('YWC enquiry delivery failed:', error?.message || error);
    return json(res, 502, { error: 'delivery-failed' });
  }
});

server.listen(port, '127.0.0.1', () => console.log(`YWC enquiry API listening on 127.0.0.1:${port}`));
