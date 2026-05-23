import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { resolveWorkspaceId } from '../utils/resolve-workspace';

export const WorkspaceId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return resolveWorkspaceId(request);
  },
);
