import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { DatabaseModule } from './database/database.module';
// Раскомментируйте для использования BullMQ (требуется запущенный Redis)
// import { QueueModule } from './modules/queue/queue.module';

@Module({
  imports: [
    // Конфигурация окружения
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // База данных (SQLite по умолчанию)
    TypeOrmModule.forRoot(databaseConfig()),
    
    // Сидеры базы данных
    DatabaseModule,
    
    // Модули приложения
    AuthModule,
    UsersModule,
    ProductsModule,
    
    // Раскомментируйте для использования BullMQ (требуется запущенный Redis)
    // QueueModule,
  ],
})
export class AppModule {}
