import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@Controller()
export class AppController {
  @Get()
  @SkipThrottle()
  getHealth() {
    return {
      ok: true,
      service: 'app-auth',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @SkipThrottle()
  getHealthCheck() {
    return {
      ok: true,
      service: 'app-auth',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}

