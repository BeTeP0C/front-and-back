import { Controller, Get } from '@nestjs/common';
import { hostname } from 'node:os';

@Controller()
export class SystemController {
  private readonly hostName = hostname();
  private readonly instanceId = process.env.INSTANCE_ID || this.hostName;
  private readonly port = Number(process.env.PORT || 4000);

  @Get()
  root() {
    return {
      message: 'TechStore API',
      instanceId: this.instanceId,
      port: this.port,
    };
  }

  @Get('api/system/instance')
  getInstance() {
    return {
      instanceId: this.instanceId,
      hostName: this.hostName,
      port: this.port,
      timestamp: new Date().toISOString(),
    };
  }

  @Get('api/system/health')
  health() {
    return {
      status: 'ok',
      instanceId: this.instanceId,
      timestamp: new Date().toISOString(),
    };
  }
}
