import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductResponseDto } from './dto';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/guards';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { EventsGateway } from '../events/events.gateway';
import { PushService } from '../push/push.service';

@ApiTags('Products')
@Controller('api/products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly eventsGateway: EventsGateway,
    private readonly pushService: PushService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать товар (admin)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, type: ProductResponseDto })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async create(@Body() dto: CreateProductDto): Promise<Product> {
    const product = await this.productsService.create(dto);
    this.eventsGateway.emitProductCreated(product);
    this.pushService.sendToAll('Новый товар', product.title, `/products/${product.id}`).catch(() => {});
    return product;
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
    const product = await this.productsService.update(id, dto);
    this.eventsGateway.emitProductUpdated(product);
    this.pushService.sendToAll('Товар обновлён', product.title, `/products/${product.id}`).catch(() => {});
    return product;
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
    const product = await this.productsService.findOne(id);
    await this.productsService.remove(id);
    this.eventsGateway.emitProductDeleted(id);
    this.pushService.sendToAll('Товар удалён', product.title, '/').catch(() => {});
  }
}
