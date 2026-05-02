import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './dto';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/guards';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать товар (admin)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Список товаров' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ): Promise<Product[]> {
    if (search) return this.productsService.search(search);
    if (category) return this.productsService.findByCategory(category);
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Товар по ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить товар (admin)' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<Product> {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить товар (admin)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
