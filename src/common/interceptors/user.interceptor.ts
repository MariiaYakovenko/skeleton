import {  CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { Observable } from 'rxjs'

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    private readonly ctx: ClsService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    this.ctx.set('userId', req.user.id)

    return next.handle()
  }
}
