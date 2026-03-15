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
  
  // Хранилище refresh-токенов в памяти
  private readonly refreshTokens = new Set<string>();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Генерация access-токена
  private generateAccessToken(user: { id: string; email: string }): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, {
      secret: ACCESS_SECRET,
      expiresIn: ACCESS_EXPIRES_IN as string | number,
    });
  }

  // Генерация refresh-токена
  private generateRefreshToken(user: { id: string; email: string }): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload, {
      secret: REFRESH_SECRET,
      expiresIn: REFRESH_EXPIRES_IN as string | number,
    });
  }

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    // Проверка существования пользователя
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(registerDto.password, this.SALT_ROUNDS);

    // Создание пользователя
    const user = await this.usersService.create({
      email: registerDto.email,
      firstName: registerDto.first_name,
      lastName: registerDto.last_name,
      password: hashedPassword,
    });

    return {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    // Поиск пользователя
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    // Генерация токенов
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Сохраняем refresh-токен
    this.refreshTokens.add(refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<TokensResponseDto> {
    // Проверка наличия токена в хранилище
    if (!this.refreshTokens.has(refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      // Верификация refresh-токена
      const payload = this.jwtService.verify(refreshToken, {
        secret: REFRESH_SECRET,
      });

      // Поиск пользователя
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Ротация refresh-токена: старый удаляем, новый создаём
      this.refreshTokens.delete(refreshToken);

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // Сохраняем новый refresh-токен
      this.refreshTokens.add(newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      // Удаляем невалидный токен из хранилища
      this.refreshTokens.delete(refreshToken);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateUser(userId: string) {
    return this.usersService.findById(userId);
  }
}
