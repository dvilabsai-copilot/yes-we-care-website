import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

export type EnquiryMail = { name: string; phone: string; email?: string; city: string; service: string; preferredDate?: string; message: string };

const escapeHtml = (value: string) => value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character] || character));

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  private transporter() {
    return nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true', auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });
  }

  private html(mail: EnquiryMail) {
    const rows = [['Full name', mail.name], ['Phone number', mail.phone], ['Email address', mail.email || 'Not provided'], ['City / location', mail.city], ['Service required', mail.service], ['Preferred date', mail.preferredDate || 'Not specified']].map(([label, value]) => `<tr><td style="padding:10px 12px;border-bottom:1px solid #dce9ee;color:#587080;font-size:13px;width:38%;">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #dce9ee;color:#0b1c3d;font-size:14px;font-weight:700;">${escapeHtml(value)}</td></tr>`).join('');
    return `<!doctype html><html><body style="margin:0;background:#eef8f5;font-family:Arial,Helvetica,sans-serif;color:#0b1c3d;"><div style="padding:28px 12px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#fff;border:1px solid #dce9ee;border-radius:16px;overflow:hidden;"><tr><td style="padding:22px 30px;background:#0b1c3d;"><div style="font-size:20px;font-weight:800;color:#fff;">Yes We Care</div><div style="margin-top:4px;font-size:10px;letter-spacing:1.4px;color:#b8c9d7;">CARE BEYOND JUST TREATMENT</div></td></tr><tr><td style="height:6px;background:#168244;font-size:0;">&nbsp;</td></tr><tr><td style="padding:30px;"><div style="font-size:11px;font-weight:800;letter-spacing:1.6px;color:#158478;margin-bottom:10px;">NEW ENQUIRY RECEIVED</div><h1 style="margin:0 0 14px;color:#0b1c3d;font-size:27px;">A new care enquiry needs your attention</h1><p style="color:#52657c;font-size:15px;line-height:1.6;">Someone submitted a request through the YWC website.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:24px 0 20px;border:1px solid #dce9ee;background:#f8fcfd;">${rows}</table><div style="padding:16px 18px;border-left:4px solid #168244;background:#eaf8f1;color:#40586b;font-size:15px;line-height:1.6;"><strong style="display:block;color:#0b1c3d;">Requirement</strong>${escapeHtml(mail.message).replaceAll('\n', '<br>')}</div></td></tr><tr><td style="padding:18px 30px;border-top:1px solid #e4eef0;background:#f6fbfd;color:#718392;font-size:12px;line-height:1.55;"><strong style="color:#0b1c3d;">Yes We Care</strong><br>Submitted from the YWC website.</td></tr></table></div></body></html>`;
  }

  async sendEnquiry(mail: EnquiryMail) {
    const text = ['New YWC website enquiry', '', `Name: ${mail.name}`, `Phone: ${mail.phone}`, `Email: ${mail.email || 'Not provided'}`, `City / Location: ${mail.city}`, `Service: ${mail.service}`, `Preferred date: ${mail.preferredDate || 'Not specified'}`, '', 'Requirement:', mail.message].join('\n');
    const payload = { from: `${process.env.SMTP_FROM_NAME || 'Yes We Care'} <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`, to: process.env.ENQUIRY_TO_EMAIL, replyTo: mail.email || undefined, subject: `YWC enquiry - ${mail.service}`, text, html: this.html(mail) };
    if (String(process.env.MAIL_DRY_RUN).toLowerCase() === 'true') { this.logger.log(`MAIL_DRY_RUN enquiry for ${mail.name}`); return { messageId: 'dry-run' }; }
    if (!payload.to || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) throw new Error('Email configuration is incomplete');
    return this.transporter().sendMail(payload);
  }
}
