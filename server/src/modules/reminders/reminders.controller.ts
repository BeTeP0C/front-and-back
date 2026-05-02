import { Controller, Post, Get, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RemindersService } from './reminders.service';
import { ScheduleReminderDto, SnoozeReminderDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Reminders')
@Controller('api/reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post('schedule')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Запланировать отложенное уведомление (admin)' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  schedule(@Body() dto: ScheduleReminderDto) {
    const reminder = this.remindersService.schedule(
      dto.title,
      dto.body,
      dto.delaySeconds,
      dto.url,
    );
    return reminder;
  }

  @Post('snooze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отложить уведомление на 5 минут' })
  @ApiResponse({ status: 200 })
  snooze(@Body() dto: SnoozeReminderDto) {
    const reminder = this.remindersService.snooze(dto.reminderId);
    return reminder;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Список активных напоминаний (admin)' })
  @ApiResponse({ status: 200 })
  getAll() {
    return this.remindersService.getAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Отменить напоминание (admin)' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Не найдено' })
  cancel(@Param('id') id: string) {
    this.remindersService.cancel(id);
  }
}
