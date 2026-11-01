import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';
import { AdminAuthGuard } from './auth';
import { PrismaService } from './prisma.service';

export const sanitizeContentHtml = (value?: string | null) => value == null ? value : sanitizeHtml(String(value), { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']), allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, img: ['src', 'alt', 'width', 'height'] }, allowedSchemes: ['http', 'https', 'mailto', 'tel'] });

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
}
