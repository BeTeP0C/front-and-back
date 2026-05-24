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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './dto';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/guards';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { EventsGateway } from '../events/events.gateway';
import { PushService } from '../push/push.service';
import {
  RedisCacheService,
  PRODUCTS_CACHE_TTL,
} from '../cache/redis-cache.service';

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly eventsGateway: EventsGateway,
    private readonly pushService: PushService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product (admin)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    const product = await this.productsService.create(dto);
    await this.redisCacheService.invalidateProducts();
    this.eventsGateway.emitProductCreated(product);
    this.pushService
      .sendToAll('Новый товар', product.title, `/products/${product.id}`)
      .catch(() => {});
    return product;
  }

  @Get()
  @ApiOperation({ summary: 'Get products list' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ): Promise<Product[]> {
    const cacheKey = this.redisCacheService.getProductsListKey(category, search);
    const cachedProducts = await this.redisCacheService.get<Product[]>(cacheKey);
    if (cachedProducts) return cachedProducts;

    let products: Product[];
    if (search) {
      products = await this.productsService.search(search);
    } else if (category) {
      products = await this.productsService.findByCategory(category);
    } else {
      products = await this.productsService.findAll();
    }

    await this.redisCacheService.set(cacheKey, products, PRODUCTS_CACHE_TTL);
    return products;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  async findOne(@Param('id') id: string): Promise<Product> {
    const cacheKey = this.redisCacheService.getProductItemKey(id);
    const cachedProduct = await this.redisCacheService.get<Product>(cacheKey);
    if (cachedProduct) return cachedProduct;

    const product = await this.productsService.findOne(id);
    await this.redisCacheService.set(cacheKey, product, PRODUCTS_CACHE_TTL);
    return product;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (admin)' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productsService.update(id, dto);
    await this.redisCacheService.invalidateProducts(id);
    this.eventsGateway.emitProductUpdated(product);
    this.pushService
      .sendToAll('Товар обновлён', product.title, `/products/${product.id}`)
      .catch(() => {});
    return product;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product (admin)' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string): Promise<void> {
    const product = await this.productsService.findOne(id);
    await this.productsService.remove(id);
    await this.redisCacheService.invalidateProducts(id);
    this.eventsGateway.emitProductDeleted(id);
    this.pushService
      .sendToAll('Товар удалён', product.title, '/')
      .catch(() => {});
  }
}
