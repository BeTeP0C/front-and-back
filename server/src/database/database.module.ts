import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../modules/products/entities/product.entity';
import { User } from '../modules/users/entities/user.entity';
import { ProductsSeeder } from './seeds/products.seed';
import { AdminSeeder } from './seeds/admin.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Product, User])],
  providers: [ProductsSeeder, AdminSeeder],
  exports: [ProductsSeeder, AdminSeeder],
})
export class DatabaseModule {}
