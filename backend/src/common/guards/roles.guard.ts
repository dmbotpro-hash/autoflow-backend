import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import {
  resolveWorkspaceId,
  resolveWorkspaceRole,
} from '../utils/resolve-workspace';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest();
    const workspaceId = resolveWorkspaceId(request);
    const role = resolveWorkspaceRole(request, workspaceId);

    if (!role || !required.includes(role)) {
      throw new ForbiddenException('Insufficient workspace permissions');
    }
    return true;
  }
}
