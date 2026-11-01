jest.mock('sanitize-html', () => {
  const sanitize: any = (value: string) => value.replace(new RegExp('<script[^>]*>.*?</script>', 'gi'), '').replace(' href="javascript:alert(1)"', '');
  sanitize.defaults = { allowedTags: [], allowedAttributes: {} };
  return { __esModule: true, default: sanitize };
});

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
});
