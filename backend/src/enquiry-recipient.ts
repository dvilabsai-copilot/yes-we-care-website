import { PrismaService } from './prisma.service';

export const ENQUIRY_RECIPIENT_KEY = 'enquiry_to_email';
export const PUBLIC_CONTACT_EMAIL_KEY = 'contact_email';
export const DEFAULT_PUBLIC_CONTACT_EMAIL = 'info@ywc.care';

export async function getEnquiryRecipient(prisma: PrismaService) {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: ENQUIRY_RECIPIENT_KEY },
    select: { value: true },
  });
  return setting?.value.trim() || process.env.ENQUIRY_TO_EMAIL?.trim() || 'info@ywc.care';
}

export async function getPublicContactEmail(prisma: PrismaService) {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: PUBLIC_CONTACT_EMAIL_KEY },
    select: { value: true },
  });
  return setting?.value.trim() || DEFAULT_PUBLIC_CONTACT_EMAIL;
}
