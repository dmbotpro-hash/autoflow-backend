import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SecurityService } from './security.service';

@Controller('security')
@UseGuards(JwtAuthGuard)
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Get('sessions')
  listSessions(@Request() req: { user: { id: string } }) {
    return this.securityService.listSessions(req.user.id);
  }

  @Delete('sessions/:id')
  revokeSession(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ) {
    return this.securityService.revokeSession(req.user.id, id);
  }

  @Post('sessions/revoke-all')
  revokeAll(@Request() req: { user: { id: string } }) {
    return this.securityService.revokeAllSessions(req.user.id);
  }

  @Get('login-history')
  loginHistory(@Request() req: { user: { id: string } }) {
    return this.securityService.listLoginHistory(req.user.id);
  }
}
