import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../modules/products/entities/product.entity';

const INITIAL_PRODUCTS = [
  { title: 'Умные часы Premium', category: 'Часы', description: 'AMOLED дисплей, мониторинг здоровья, IP68.', price: 12990, image: 'https://cdn.pixabay.com/photo/2015/06/25/17/22/smart-watch-821565_640.jpg' },
  { title: 'Беспроводные наушники Pro', category: 'Аудио', description: 'Активное шумоподавление, до 30ч работы.', price: 8490, image: 'https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_640.jpg' },
  { title: 'Камера Polaroid Mini', category: 'Фото', description: 'Мгновенные снимки, вспышка, автоэкспозиция.', price: 6390, image: 'https://cdn.pixabay.com/photo/2014/08/05/10/31/polaroid-410681_640.jpg' },
  { title: 'Смартфон Galaxy X', category: 'Смартфоны', description: '6.7" экран, камера 108МП.', price: 79990, image: 'https://cdn.pixabay.com/photo/2016/11/29/05/08/smartphone-1867467_640.jpg' },
  { title: 'Портативная колонка Boom', category: 'Аудио', description: 'Bluetooth, глубокие басы, IPX7.', price: 4990, image: 'https://cdn.pixabay.com/photo/2017/08/09/15/45/speaker-2614558_640.jpg' },
  { title: 'Фитнес-браслет Active', category: 'Часы', description: 'Пульсометр, шагомер, батарея 14 дней.', price: 2990, image: 'https://cdn.pixabay.com/photo/2021/01/06/07/52/smart-watch-5893906_640.jpg' },
  { title: 'Ноутбук ProBook 15', category: 'Компьютеры', description: 'Intel Core i7, 16ГБ RAM, SSD 512ГБ.', price: 89990, image: 'https://cdn.pixabay.com/photo/2016/03/27/07/12/apple-1282241_640.jpg' },
  { title: 'Игровая мышь Viper', category: 'Аксессуары', description: '16000 DPI, RGB, 8 кнопок.', price: 3490, image: 'https://cdn.pixabay.com/photo/2017/05/24/21/33/workplace-2341642_640.jpg' },
  { title: 'Механическая клавиатура TKL', category: 'Аксессуары', description: 'Cherry MX, RGB подсветка.', price: 7990, image: 'https://cdn.pixabay.com/photo/2015/05/26/23/52/technology-785742_640.jpg' },
  { title: 'Внешний SSD 1TB', category: 'Накопители', description: 'USB-C, до 1050 МБ/с.', price: 8990, image: 'https://cdn.pixabay.com/photo/2017/03/21/21/53/hard-disk-2163766_640.jpg' },
  { title: 'Веб-камера 4K Pro', category: 'Аксессуары', description: '4K, автофокус, микрофон.', price: 9990, image: 'https://cdn.pixabay.com/photo/2020/04/14/11/55/webcam-5042320_640.jpg' },
  { title: 'Планшет Tab S8', category: 'Планшеты', description: '11" IPS, стилус в комплекте.', price: 45990, image: 'https://cdn.pixabay.com/photo/2014/09/24/14/29/ipad-459183_640.jpg' },
];

@Injectable()
export class ProductsSeeder implements OnModuleInit {
  private readonly logger = new Logger(ProductsSeeder.name);

  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count > 0) {
      this.logger.log('Products already seeded, skipping...');
      return;
    }
    this.logger.log('Seeding products...');
    for (const data of INITIAL_PRODUCTS) {
      await this.repo.save(this.repo.create(data));
    }
    this.logger.log(`Seeded ${INITIAL_PRODUCTS.length} products`);
  }
}
