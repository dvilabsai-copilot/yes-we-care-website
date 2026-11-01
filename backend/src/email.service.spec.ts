import { EmailService } from './email.service';

describe('EmailService', () => {
  const original = { ...process.env };
  afterEach(() => { process.env = { ...original }; });

  it('uses dry-run mode without requiring SMTP credentials', async () => {
    process.env.MAIL_DRY_RUN = 'true';
    const service = new EmailService();
    await expect(service.sendEnquiry({ name: 'Test Person', phone: '9000000001', city: 'Chennai', service: 'Hospital Assistance', message: 'A sufficiently long local test enquiry.' })).resolves.toEqual({ messageId: 'dry-run' });
  });

  it('renders a branded email and escapes untrusted content', () => {
    const service = new EmailService() as any;
    const html = service.html({ name: '<script>alert(1)</script>', phone: '9000000001', city: 'Chennai', service: 'Hospital Assistance', message: '<img src=x onerror=alert(1)>' });
    expect(html).toContain('Yes We Care');
    expect(html).toContain('NEW ENQUIRY RECEIVED');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
  });
});
