import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreatePracticeUserDto,
  UpdatePracticeUserDto,
  PracticeUserResponseDto,
} from './dto';
import { PracticeUsersService } from './practice-users.service';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly practiceUsersService: PracticeUsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreatePracticeUserDto })
  @ApiResponse({ status: 201, type: PracticeUserResponseDto })
  create(
    @Body() dto: CreatePracticeUserDto,
  ): Promise<PracticeUserResponseDto> {
    return this.practiceUsersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [PracticeUserResponseDto] })
  findAll(): Promise<PracticeUserResponseDto[]> {
    return this.practiceUsersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: PracticeUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PracticeUserResponseDto> {
    return this.practiceUsersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePracticeUserDto })
  @ApiResponse({ status: 200, type: PracticeUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePracticeUserDto,
  ): Promise<PracticeUserResponseDto> {
    return this.practiceUsersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.practiceUsersService.remove(id);
  }
}
