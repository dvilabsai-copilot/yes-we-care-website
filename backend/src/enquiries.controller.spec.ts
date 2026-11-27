import { EnquiriesController, minimumPreferredDate } from './enquiries.controller';

describe('EnquiriesController', () => {
  it('starts availability seven days after today in India', () => {
    expect(minimumPreferredDate(new Date('2026-11-26T18:30:00.000Z'))).toBe('2026-12-04');
  });

  it('stores and sends a valid enquiry', async () => {
    const created = { id: 'enquiry-1', name: 'Test', phone: '9000000001', email: null, city: 'Chennai', service: 'Hospital Assistance', preferredDate: minimumPreferredDate(), message: 'A valid local test enquiry.', consent: true };
    const prisma = { enquiry: { create: jest.fn().mockResolvedValue(created), update: jest.fn().mockResolvedValue(created) } } as any;
    const email = { sendEnquiry: jest.fn().mockResolvedValue({ messageId: 'dry-run' }) } as any;
    const controller = new EnquiriesController(prisma, email);
    await expect(controller.create({ ...created } as any)).resolves.toEqual({ ok: true });
    expect(email.sendEnquiry).toHaveBeenCalled();
    expect(prisma.enquiry.update).toHaveBeenCalledWith(expect.objectContaining({ data: { status: 'SENT' } }));
  });

  it('rejects an enquiry without consent', async () => {
    const prisma = { enquiry: { create: jest.fn() } } as any;
    const email = { sendEnquiry: jest.fn() } as any;
    const controller = new EnquiriesController(prisma, email);
    await expect(controller.create({ consent: false } as any)).rejects.toThrow('consent-required');
    expect(prisma.enquiry.create).not.toHaveBeenCalled();
    expect(email.sendEnquiry).not.toHaveBeenCalled();
  });

  it('requires a preferred date within the allowed window', async () => {
    const prisma = { enquiry: { create: jest.fn() } } as any;
    const email = { sendEnquiry: jest.fn() } as any;
    const controller = new EnquiriesController(prisma, email);
    const base = { name: 'Test', phone: '9000000001', city: 'Chennai', service: 'Hospital Assistance', message: 'A valid local test enquiry.', consent: true };
    await expect(controller.create(base as any)).rejects.toThrow('preferred-date-required');
    await expect(controller.create({ ...base, preferredDate: '2000-01-01' } as any)).rejects.toThrow('preferred-date-too-soon');
    expect(prisma.enquiry.create).not.toHaveBeenCalled();
  });
});
