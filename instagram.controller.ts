import { Controller, Get } from '@nestjs/common';

@Controller('instagram')
export class InstagramController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'Hello from Instagram Controller!';
  }
}