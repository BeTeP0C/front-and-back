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
import {
  RedisCacheService,
  USERS_CACHE_TTL,
} from '../cache/redis-cache.service';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(
    private readonly practiceUsersService: PracticeUsersService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiBody({ type: CreatePracticeUserDto })
  @ApiResponse({ status: 201, type: PracticeUserResponseDto })
  create(
    @Body() dto: CreatePracticeUserDto,
  ): Promise<PracticeUserResponseDto> {
    return this.createAndInvalidateCache(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [PracticeUserResponseDto] })
  async findAll(): Promise<PracticeUserResponseDto[]> {
    const cacheKey = this.redisCacheService.getUsersListKey();
    const cachedUsers =
      await this.redisCacheService.get<PracticeUserResponseDto[]>(cacheKey);
    if (cachedUsers) return cachedUsers;

    const users = await this.practiceUsersService.findAll();
    await this.redisCacheService.set(cacheKey, users, USERS_CACHE_TTL);
    return users;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: PracticeUserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PracticeUserResponseDto> {
    return this.findOneWithCache(id);
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
    return this.updateAndInvalidateCache(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.practiceUsersService.remove(id);
    await this.redisCacheService.invalidateUsers(id);
  }

  private async createAndInvalidateCache(
    dto: CreatePracticeUserDto,
  ): Promise<PracticeUserResponseDto> {
    const createdUser = await this.practiceUsersService.create(dto);
    await this.redisCacheService.invalidateUsers(createdUser.id);
    return createdUser;
  }

  private async findOneWithCache(
    id: number,
  ): Promise<PracticeUserResponseDto> {
    const cacheKey = this.redisCacheService.getUserItemKey(id);
    const cachedUser =
      await this.redisCacheService.get<PracticeUserResponseDto>(cacheKey);
    if (cachedUser) return cachedUser;

    const user = await this.practiceUsersService.findOne(id);
    await this.redisCacheService.set(cacheKey, user, USERS_CACHE_TTL);
    return user;
  }

  private async updateAndInvalidateCache(
    id: number,
    dto: UpdatePracticeUserDto,
  ): Promise<PracticeUserResponseDto> {
    const updatedUser = await this.practiceUsersService.update(id, dto);
    await this.redisCacheService.invalidateUsers(id);
    return updatedUser;
  }
}
