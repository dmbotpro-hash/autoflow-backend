import { Controller, Get } from '@nestjs/common';

@Controller('instagram')
export class InstagramController {
  
  @Get()
  getStatus() {
    return {
      status: 'active',
      message: 'AutoFlow Instagram Module is online'
    };
  }
}