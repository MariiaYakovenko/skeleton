import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyJWT } from '../../modules/auth/utils/jwt.utils';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly config: ConfigService,
              private readonly ctx: ClsService) {}

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const payload = verifyJWT(
      auth.slice(7),
      Buffer.from(this.config.getOrThrow<string>('JWT_ACCESS_SECRET'), 'base64')
    );
    if (!payload) {
      throw new UnauthorizedException();
    }

    this.ctx.set<string>('userId', payload.sub);
    req.user = { id: payload.sub };

    return true;
  }
}