import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../user/user.module';
import { TokenService } from './services/token.service';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, TokenService, RefreshTokenRepository],
})
export class AuthModule {}
