import { PrismaService } from './prisma.service';

export const ENQUIRY_RECIPIENT_KEY = 'enquiry_to_email';

export async function getEnquiryRecipient(prisma: PrismaService) {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: ENQUIRY_RECIPIENT_KEY },
    select: { value: true },
  });
  return setting?.value.trim() || process.env.ENQUIRY_TO_EMAIL?.trim() || 'info@ywc.care';
}
