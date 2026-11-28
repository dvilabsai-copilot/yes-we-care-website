import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEmail, MaxLength } from 'class-validator';
import sanitizeHtml from 'sanitize-html';
import { AdminAuthGuard } from './auth';
import { ENQUIRY_RECIPIENT_KEY, getEnquiryRecipient } from './enquiry-recipient';
import { PrismaService } from './prisma.service';

export class UpdateGlobalSettingsDto {
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsEmail()
  @MaxLength(254)
  enquiryRecipientEmail!: string;
}

const contentHtmlOptions: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'form', 'label', 'input', 'select', 'option', 'textarea', 'button', 'details', 'summary'],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    '*': ['class', 'aria-hidden', 'aria-label', 'aria-live', 'role'],
    div: [{ name: 'id', values: ['form-feedback'] }],
    img: ['src', 'alt', 'width', 'height', 'loading'],
    form: ['novalidate', { name: 'id', values: ['enquiry-form'] }],
    label: ['for'],
    input: ['name', 'value', 'required', 'minlength', 'placeholder', 'autocomplete', 'inputmode', 'pattern',
      { name: 'type', values: ['text', 'tel', 'email', 'date', 'checkbox'] }],
    select: ['name', 'required'],
    option: ['value', 'selected'],
    textarea: ['name', 'required', 'minlength', 'maxlength', 'rows', 'placeholder'],
    button: [{ name: 'type', values: ['button', 'submit', 'reset'] }]
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: {
    '*': (tagName, attribs) => {
      if ((tagName === 'form' && attribs.id !== 'enquiry-form') ||
          (tagName === 'div' && attribs.id !== 'form-feedback')) {
        delete attribs.id;
      }
      return { tagName, attribs };
    }
  }
};

export function sanitizeContentHtml(value?: string | null) {
  return value == null ? value : sanitizeHtml(String(value), contentHtmlOptions);
}

@Controller('api/admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('pages')
  pages() { return this.prisma.page.findMany({ orderBy: { slug: 'asc' }, select: { id: true, slug: true, title: true, status: true, updatedAt: true, _count: { select: { sections: true } } } }); }

  @Get('pages/:id')
  page(@Param('id') id: string) { return this.prisma.page.findUniqueOrThrow({ where: { id }, include: { sections: { orderBy: { position: 'asc' }, include: { items: { orderBy: { position: 'asc' } } } } } }); }

  @Patch('pages/:id')
  updatePage(@Param('id') id: string, @Body() body: { title?: string; metaTitle?: string; metaDescription?: string; status?: string }) { return this.prisma.page.update({ where: { id }, data: { title: body.title, metaTitle: body.metaTitle, metaDescription: body.metaDescription, status: body.status } }); }

  @Patch('sections/:id')
  updateSection(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    const data: Record<string, unknown> = {};
    for (const field of ['eyebrow', 'title', 'accentText', 'imagePath', 'theme', 'sectionType']) if (field in body) data[field] = body[field] == null ? null : String(body[field]);
    if ('bodyHtml' in body) data.bodyHtml = sanitizeContentHtml(body.bodyHtml as string);
    if ('isVisible' in body) data.isVisible = Boolean(body.isVisible);
    if ('position' in body) data.position = Number(body.position);
    return this.prisma.pageSection.update({ where: { id }, data });
  }

  @Delete('sections/:id')
  deleteSection(@Param('id') id: string) { return this.prisma.pageSection.delete({ where: { id } }); }

  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    const data: Record<string, unknown> = {};
    for (const field of ['itemType', 'title', 'icon', 'linkUrl', 'imagePath']) if (field in body) data[field] = body[field] == null ? null : String(body[field]);
    if ('bodyHtml' in body) data.bodyHtml = sanitizeContentHtml(body.bodyHtml as string);
    if ('position' in body) data.position = Number(body.position);
    return this.prisma.sectionItem.update({ where: { id }, data });
  }

  @Get('enquiries')
  enquiries() { return this.prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }); }

  @Get('settings')
  async settings() {
    return { enquiryRecipientEmail: await getEnquiryRecipient(this.prisma) };
  }

  @Patch('settings')
  async updateSettings(@Body() { enquiryRecipientEmail }: UpdateGlobalSettingsDto) {
    const saved = await this.prisma.siteSetting.upsert({
      where: { key: ENQUIRY_RECIPIENT_KEY },
      update: { value: enquiryRecipientEmail },
      create: { key: ENQUIRY_RECIPIENT_KEY, value: enquiryRecipientEmail },
    });
    return { enquiryRecipientEmail: saved.value };
  }
}
