import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PracticeUser } from './entities/practice-user.entity';
import {
  CreatePracticeUserDto,
  UpdatePracticeUserDto,
  PracticeUserResponseDto,
} from './dto';

@Injectable()
export class PracticeUsersService {
  constructor(
    @InjectRepository(PracticeUser)
    private readonly practiceUsersRepository: Repository<PracticeUser>,
  ) {}

  async create(
    dto: CreatePracticeUserDto,
  ): Promise<PracticeUserResponseDto> {
    const user = this.practiceUsersRepository.create({
      firstName: dto.first_name.trim(),
      lastName: dto.last_name.trim(),
      age: dto.age,
    });
    const savedUser = await this.practiceUsersRepository.save(user);
    return this.toResponse(savedUser);
  }

  async findAll(): Promise<PracticeUserResponseDto[]> {
    const users = await this.practiceUsersRepository.find({
      order: { createdAt: 'DESC' },
    });
    return users.map((user) => this.toResponse(user));
  }

  async findOne(id: number): Promise<PracticeUserResponseDto> {
    const user = await this.findEntityByIdOrThrow(id);
    return this.toResponse(user);
  }

  async update(
    id: number,
    dto: UpdatePracticeUserDto,
  ): Promise<PracticeUserResponseDto> {
    const user = await this.findEntityByIdOrThrow(id);

    if (dto.first_name !== undefined) {
      user.firstName = dto.first_name.trim();
    }
    if (dto.last_name !== undefined) {
      user.lastName = dto.last_name.trim();
    }
    if (dto.age !== undefined) {
      user.age = dto.age;
    }

    const savedUser = await this.practiceUsersRepository.save(user);
    return this.toResponse(savedUser);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findEntityByIdOrThrow(id);
    await this.practiceUsersRepository.remove(user);
  }

  private async findEntityByIdOrThrow(id: number): Promise<PracticeUser> {
    const user = await this.practiceUsersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private toResponse(user: PracticeUser): PracticeUserResponseDto {
    return {
      id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      age: user.age,
      created_at: Math.floor(user.createdAt.getTime() / 1000),
      updated_at: Math.floor(user.updatedAt.getTime() / 1000),
    };
  }
}
