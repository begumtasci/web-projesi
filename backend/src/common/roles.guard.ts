import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Controller/handler icin tanimlanan rollerini metadata uzerinden toplar.
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];
    if (!requiredRoles.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException();
    }
    // JWT icindeki roleName ile gereken roller uyusursa istege izin verilir.
    return requiredRoles.includes(user.role?.roleName);
  }
}
