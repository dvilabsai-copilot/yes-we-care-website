import { AdminController, sanitizeContentHtml } from './admin.controller';

describe('AdminController', () => {
  it('removes unsafe tags and protocols from WYSIWYG content', () => {
    expect(sanitizeContentHtml('<p>Safe</p><script>alert(1)</script><a href="javascript:alert(1)">bad</a>')).toBe('<p>Safe</p><a>bad</a>');
  });

  it('sanitizes WYSIWYG HTML before persistence', async () => {
    const prisma = { pageSection: { update: jest.fn().mockResolvedValue({ bodyHtml: '<p>Safe</p>' }) } } as any;
    const controller = new AdminController(prisma);
    await controller.updateSection('section-1', { bodyHtml: '<p>Safe</p><script>alert(1)</script><a href="javascript:alert(1)">bad</a>' });
    expect(prisma.pageSection.update).toHaveBeenCalledWith(expect.objectContaining({ data: { bodyHtml: '<p>Safe</p><a>bad</a>' } }));
  });

  it('retains layout, call-to-action, image and accessibility attributes on CMS round trips', () => {
    const html = '<div class="container hero-grid"><div class="hero-copy"><p>Saved copy</p>' +
      '<a class="btn btn-primary" href="contact.html#enquiry">Request Assistance <span aria-hidden="true">→</span></a></div>' +
      '<div class="hero-media"><img src="assets/care-family.jpg" loading="eager" alt="Family" /></div></div>';
    expect(sanitizeContentHtml(html)).toBe(html);
  });

  it('retains the enquiry UI while stripping arbitrary identities, form destinations and inline styles', () => {
    const html = '<form id="enquiry-form" class="enquiry-form" action="https://example.com">' +
      '<input type="email" name="email" required /><button type="submit" formaction="https://example.com">Send</button>' +
      '<div id="form-feedback" role="status" aria-live="polite"></div><div id="unapproved" style="color:red">Text</div></form>';
    expect(sanitizeContentHtml(html)).toBe('<form id="enquiry-form" class="enquiry-form">' +
      '<input type="email" name="email" required /><button type="submit">Send</button>' +
      '<div id="form-feedback" role="status" aria-live="polite"></div><div>Text</div></form>');
  });
});
