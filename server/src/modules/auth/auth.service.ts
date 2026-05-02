import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, UserResponseDto, LoginResponseDto, TokensResponseDto } from './dto';
import {
  ACCESS_SECRET,
  ACCESS_EXPIRES_IN,
  REFRESH_SECRET,
  REFRESH_EXPIRES_IN,
} from '../../config/jwt.config';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;
  private readonly refreshTokens = new Set<string>();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private generateAccessToken(user: {
    id: string;
    email: string;
    role: string;
  }): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: ACCESS_SECRET, expiresIn: ACCESS_EXPIRES_IN } as any,
    );
  }

  private generateRefreshToken(user: {
    id: string;
    email: string;
    role: string;
  }): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: REFRESH_SECRET, expiresIn: REFRESH_EXPIRES_IN } as any,
    );
  }

  private toUserResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      role: user.role,
    };
  }

  async register(dto: RegisterDto): Promise<UserResponseDto> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Пользователь с таким email уже существует');

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
    const user = await this.usersService.create({
      email: dto.email,
      firstName: dto.first_name,
      lastName: dto.last_name,
      password: hashedPassword,
    });

    return this.toUserResponse(user);
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new NotFoundException('Пользователь не найден');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Неверный пароль');

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    this.refreshTokens.add(refreshToken);

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<TokensResponseDto> {
    if (!this.refreshTokens.has(refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, { secret: REFRESH_SECRET });
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      this.refreshTokens.delete(refreshToken);

      const newAccess = this.generateAccessToken(user);
      const newRefresh = this.generateRefreshToken(user);
      this.refreshTokens.add(newRefresh);

      return { accessToken: newAccess, refreshToken: newRefresh };
    } catch {
      this.refreshTokens.delete(refreshToken);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
