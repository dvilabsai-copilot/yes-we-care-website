import { Body, Controller, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from './prisma.service';
import { IsString, Length } from 'class-validator';
import { AdminAuthGuard, AuthRequest } from './auth';

export class ChangePasswordDto {
  @IsString() @Length(1, 128) currentPassword!: string;
  @IsString() @Length(8, 128) newPassword!: string;
}

@Controller('api/admin/auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  @Post('login')
  async login(@Body() body: { email?: string; password?: string }) {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.passwordHash))) throw new UnauthorizedException('Invalid credentials');
    return { accessToken: await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role }), user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  @Patch('password')
  @UseGuards(AdminAuthGuard)
  async changePassword(@Req() request: AuthRequest, @Body() dto: ChangePasswordDto) {
    const userId = request.user?.sub;
    if (!userId) throw new UnauthorizedException('Authentication required');
    const user = await this.prisma.adminUser.findUnique({ where: { id: userId } });
    if (!user || !user.isActive || !(await bcrypt.compare(dto.currentPassword, user.passwordHash))) throw new UnauthorizedException('Current password is incorrect');
    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash } });
    return { ok: true };
  }
}
