import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const jwtConfig = (): JwtModuleOptions => ({
  secret: JWT_SECRET,
  signOptions: {
    expiresIn: JWT_EXPIRES_IN,
  } as JwtSignOptions,
});
