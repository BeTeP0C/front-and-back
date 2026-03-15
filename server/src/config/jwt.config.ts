import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const ACCESS_SECRET =
  process.env.JWT_SECRET || 'access-secret-change-me';
export const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

export const REFRESH_SECRET =
  process.env.REFRESH_SECRET || 'refresh-secret-change-me';
export const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d';

export const jwtConfig = (): JwtModuleOptions => ({
  secret: ACCESS_SECRET,
  signOptions: { expiresIn: ACCESS_EXPIRES_IN } as JwtSignOptions,
});
