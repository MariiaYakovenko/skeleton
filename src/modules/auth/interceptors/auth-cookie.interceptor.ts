import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import * as cookie from 'cookie';

@Injectable()
export class AuthCookieInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const http = ctx.switchToHttp();
    const res: any = http.getResponse();

    const appendSetCookie = (cookieStr: string) => {
      const prev = res.getHeader?.('Set-Cookie');
      const list = ([] as string[]).concat(prev as any || []);
      res.setHeader?.('Set-Cookie', [...list, cookieStr]);
    };

    return next.handle().pipe(
      map((data) => {
        const refresh = data?.session.refresh_token;
        if (!refresh) {
          return;
        }

        const cookieStr = cookie.serialize('refresh_token', refresh, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 604800,
        });
        appendSetCookie(cookieStr);

        const { refresh_token, ...sessionRest } = data.session;

        return { ...data, session: sessionRest };
      }),
    );
  }
}
