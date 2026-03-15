import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from './dto';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать товар' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Товар создан',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации',
  })
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список товаров' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Фильтр по категории',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Поиск по названию и описанию',
  })
  @ApiResponse({
    status: 200,
    description: 'Список товаров',
    type: [ProductResponseDto],
  })
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ): Promise<Product[]> {
    if (search) {
      return this.productsService.search(search);
    }
    if (category) {
      return this.productsService.findByCategory(category);
    }
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiParam({ name: 'id', description: 'ID товара' })
  @ApiResponse({
    status: 200,
    description: 'Данные товара',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить параметры товара' })
  @ApiParam({ name: 'id', description: 'ID товара' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Обновленный товар',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить товар' })
  @ApiParam({ name: 'id', description: 'ID товара' })
  @ApiResponse({
    status: 204,
    description: 'Товар удален',
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
