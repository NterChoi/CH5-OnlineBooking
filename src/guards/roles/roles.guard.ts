import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log(user);
    console.log(user.role);

    if (user && user.role === 1){
      return true
    }
    throw new ForbiddenException('접근이 금지되었습니다!');
  }
}
