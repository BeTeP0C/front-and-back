import { PartialType } from '@nestjs/swagger';
import { CreatePracticeUserDto } from './create-practice-user.dto';

export class UpdatePracticeUserDto extends PartialType(CreatePracticeUserDto) {}
