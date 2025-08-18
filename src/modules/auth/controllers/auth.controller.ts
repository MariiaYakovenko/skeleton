import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CredentialsDto } from '../dto/in/credentials.dto';
import { AuthDto } from '../dto/out/tokens.dto';
import { AuthCookieInterceptor } from '../interceptors/auth-cookie.interceptor';
import { ResetPasswordDto } from '../dto/in/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {
  }

  @UseInterceptors(AuthCookieInterceptor)
  @Post('signup')
  async signUp(@Body() dto: CredentialsDto): Promise<AuthDto > {
    return this.service.signUp(dto.email, dto.password);
  }

  @UseInterceptors(AuthCookieInterceptor)
  @Post('login')
  async logIn(@Body() dto: CredentialsDto): Promise<AuthDto > {
    return this.service.logIn(dto.email, dto.password);
  }

  @UseInterceptors(AuthCookieInterceptor)
  @Post('password/reset')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<AuthDto > {
    return this.service.resetPassword(dto);
  }
}
