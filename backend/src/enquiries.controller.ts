import { BadRequestException, Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IsBoolean, IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator';
import { EmailService } from './email.service';
import { PrismaService } from './prisma.service';

export class EnquiryDto {
  @IsString() @Length(2, 120) name!: string;
  @IsString() @Matches(/^[0-9+ ()-]{10,20}$/) phone!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsString() @Length(2, 120) city!: string;
  @IsString() @Length(2, 120) service!: string;
  @IsOptional() @IsString() preferredDate?: string;
  @IsString() @Length(10, 2000) message!: string;
  @IsBoolean() consent!: boolean;
}

@Controller('ywc/api')
export class EnquiriesController {
  constructor(private readonly prisma: PrismaService, private readonly email: EmailService) {}

  @Post('enquiry')
  @HttpCode(200)
  async create(@Body() dto: EnquiryDto) {
    if (!dto.consent) throw new BadRequestException('consent-required');
    const enquiry = await this.prisma.enquiry.create({ data: { name: dto.name.trim(), phone: dto.phone.trim(), email: dto.email?.trim() || null, city: dto.city.trim(), service: dto.service.trim(), preferredDate: dto.preferredDate?.trim() || null, message: dto.message.trim(), consent: dto.consent } });
    try { await this.email.sendEnquiry({ name: enquiry.name, phone: enquiry.phone, email: enquiry.email || undefined, city: enquiry.city, service: enquiry.service, preferredDate: enquiry.preferredDate || undefined, message: enquiry.message }); await this.prisma.enquiry.update({ where: { id: enquiry.id }, data: { status: 'SENT' } }); } catch { await this.prisma.enquiry.update({ where: { id: enquiry.id }, data: { status: 'EMAIL_FAILED' } }); return { ok: false, error: 'delivery-failed' }; }
    return { ok: true };
  }
}
