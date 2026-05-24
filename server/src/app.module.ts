import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { AdminModule } from './modules/admin/admin.module';
import { EventsModule } from './modules/events/events.module';
import { PushModule } from './modules/push/push.module';
import { RemindersModule } from './modules/reminders/reminders.module';
import { RedisCacheModule } from './modules/cache/redis-cache.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    RedisCacheModule,
    TypeOrmModule.forRoot(databaseConfig()),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    AdminModule,
    EventsModule,
    PushModule,
    RemindersModule,
  ],
})
export class AppModule {}
