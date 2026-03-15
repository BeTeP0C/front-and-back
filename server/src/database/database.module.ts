import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../modules/products/entities/product.entity';
import { ProductsSeeder } from './seeds/products.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductsSeeder],
  exports: [ProductsSeeder],
})
export class DatabaseModule {}
