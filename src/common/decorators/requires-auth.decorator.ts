import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common'
import { JwtGuard } from '../guards/jwt.guard';
import { UserInterceptor } from '../interceptors/user.interceptor';

export const RequiresAuth = () => {
  return applyDecorators(UseGuards(JwtGuard), UseInterceptors(UserInterceptor))
}
