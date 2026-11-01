import { EnquiriesController } from './enquiries.controller';

describe('EnquiriesController', () => {
  it('stores and sends a valid enquiry', async () => {
    const created = { id: 'enquiry-1', name: 'Test', phone: '9000000001', email: null, city: 'Chennai', service: 'Hospital Assistance', preferredDate: null, message: 'A valid local test enquiry.', consent: true };
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
});
