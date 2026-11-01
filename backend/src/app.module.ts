import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AuthController } from './auth.controller';
import { EmailService } from './email.service';
import { EnquiriesController } from './enquiries.controller';
import { PrismaService } from './prisma.service';
import { PublicContentController } from './public-content.controller';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET || 'local-only-ywc-secret', signOptions: { expiresIn: '8h' } })],
  controllers: [AuthController, PublicContentController, AdminController, EnquiriesController],
  providers: [PrismaService, EmailService]
})
export class AppModule {}
