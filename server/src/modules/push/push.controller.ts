import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PushService } from './push.service';
import { SubscribeDto, UnsubscribeDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Push Notifications')
@Controller('api/push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Get('vapid-key')
  @ApiOperation({ summary: 'Получить VAPID public key' })
  @ApiResponse({ status: 200 })
  getVapidKey() {
    return { key: this.pushService.getVapidPublicKey() };
  }

  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Подписаться на push-уведомления' })
  @ApiResponse({ status: 201 })
  async subscribe(@Body() dto: SubscribeDto) {
    await this.pushService.subscribe(dto);
    return { message: 'Подписка оформлена' };
  }

  @Post('unsubscribe')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отписаться от push-уведомлений' })
  @ApiResponse({ status: 200 })
  async unsubscribe(@Body() dto: UnsubscribeDto) {
    await this.pushService.unsubscribe(dto.endpoint);
    return { message: 'Подписка удалена' };
  }

  @Post('test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить тестовый push (admin)' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async sendTest() {
    await this.pushService.sendToAll('TechStore', 'Тестовое push-уведомление!');
    return { message: 'Push отправлен' };
  }
}
