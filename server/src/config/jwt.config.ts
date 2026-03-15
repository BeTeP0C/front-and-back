import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

// Access token config
export const ACCESS_SECRET = process.env.JWT_SECRET || 'access-secret-key-change-in-production';
export const ACCESS_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';

// Refresh token config
export const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh-secret-key-change-in-production';
export const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d';

export const jwtConfig = (): JwtModuleOptions => ({
  secret: ACCESS_SECRET,
  signOptions: {
    expiresIn: ACCESS_EXPIRES_IN,
  } as JwtSignOptions,
});
