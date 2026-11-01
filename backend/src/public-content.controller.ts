import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('api/public')
export class PublicContentController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('pages/:slug')
  async page(@Param('slug') slug: string) {
    const page = await this.prisma.page.findUnique({ where: { slug }, include: { sections: { where: { isVisible: true }, orderBy: { position: 'asc' }, include: { items: { orderBy: { position: 'asc' } } } } } });
    if (!page || page.status !== 'PUBLISHED') throw new NotFoundException('Page not found');
    return page;
  }

  @Get('services')
  services() { return this.prisma.service.findMany({ where: { isVisible: true }, orderBy: { position: 'asc' }, include: { bullets: { orderBy: { position: 'asc' } } } }); }

  @Get('services/:slug')
  async service(@Param('slug') slug: string) {
    const service = await this.prisma.service.findUnique({ where: { slug }, include: { bullets: { orderBy: { position: 'asc' } } } });
    if (!service || !service.isVisible) throw new NotFoundException('Service not found');
    return service;
  }

  @Get('faqs')
  faqs() { return this.prisma.faq.findMany({ where: { isVisible: true }, orderBy: { position: 'asc' } }); }

  @Get('settings')
  async settings() { const rows = await this.prisma.siteSetting.findMany(); return Object.fromEntries(rows.map(row => [row.key, row.value])); }
}
