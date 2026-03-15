import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../modules/products/entities/product.entity';

const INITIAL_PRODUCTS = [
  {
    title: 'Умные часы Premium',
    category: 'Часы',
    description: 'Стильные умные часы с AMOLED дисплеем, мониторингом здоровья и водозащитой IP68.',
    price: 12990,
    image: 'https://cdn.pixabay.com/photo/2015/06/25/17/22/smart-watch-821565_640.jpg',
  },
  {
    title: 'Беспроводные наушники Pro',
    category: 'Аудио',
    description: 'Наушники с активным шумоподавлением и кристально чистым звуком. До 30 часов работы.',
    price: 8490,
    image: 'https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_640.jpg',
  },
  {
    title: 'Камера Polaroid Mini',
    category: 'Фото',
    description: 'Ретро-камера для мгновенных снимков. Встроенная вспышка и автоматическая экспозиция.',
    price: 6390,
    image: 'https://cdn.pixabay.com/photo/2014/08/05/10/31/polaroid-410681_640.jpg',
  },
  {
    title: 'Смартфон Galaxy X',
    category: 'Смартфоны',
    description: 'Флагманский смартфон с 6.7" экраном, камерой 108 МП и процессором нового поколения.',
    price: 79990,
    image: 'https://cdn.pixabay.com/photo/2016/11/29/05/08/smartphone-1867467_640.jpg',
  },
  {
    title: 'Портативная колонка Boom',
    category: 'Аудио',
    description: 'Мощная Bluetooth-колонка с глубокими басами. Защита от воды IPX7.',
    price: 4990,
    image: 'https://cdn.pixabay.com/photo/2017/08/09/15/45/speaker-2614558_640.jpg',
  },
  {
    title: 'Фитнес-браслет Active',
    category: 'Часы',
    description: 'Легкий фитнес-трекер с пульсометром, шагомером и уведомлениями. Батарея на 14 дней.',
    price: 2990,
    image: 'https://cdn.pixabay.com/photo/2021/01/06/07/52/smart-watch-5893906_640.jpg',
  },
  {
    title: 'Ноутбук ProBook 15',
    category: 'Компьютеры',
    description: 'Производительный ноутбук с Intel Core i7, 16 ГБ RAM и SSD 512 ГБ.',
    price: 89990,
    image: 'https://cdn.pixabay.com/photo/2016/03/27/07/12/apple-1282241_640.jpg',
  },
  {
    title: 'Игровая мышь Viper',
    category: 'Аксессуары',
    description: 'Игровая мышь с сенсором 16000 DPI, RGB подсветкой и 8 программируемыми кнопками.',
    price: 3490,
    image: 'https://cdn.pixabay.com/photo/2017/05/24/21/33/workplace-2341642_640.jpg',
  },
  {
    title: 'Механическая клавиатура TKL',
    category: 'Аксессуары',
    description: 'Компактная механическая клавиатура с Cherry MX переключателями и RGB подсветкой.',
    price: 7990,
    image: 'https://cdn.pixabay.com/photo/2015/05/26/23/52/technology-785742_640.jpg',
  },
  {
    title: 'Внешний SSD 1TB',
    category: 'Накопители',
    description: 'Быстрый внешний SSD накопитель с интерфейсом USB-C. Скорость до 1050 МБ/с.',
    price: 8990,
    image: 'https://cdn.pixabay.com/photo/2017/03/21/21/53/hard-disk-2163766_640.jpg',
  },
  {
    title: 'Веб-камера 4K Pro',
    category: 'Аксессуары',
    description: 'Профессиональная веб-камера с разрешением 4K, автофокусом и встроенным микрофоном.',
    price: 9990,
    image: 'https://cdn.pixabay.com/photo/2020/04/14/11/55/webcam-5042320_640.jpg',
  },
  {
    title: 'Планшет Tab S8',
    category: 'Планшеты',
    description: 'Планшет с 11" IPS экраном, стилусом в комплекте и мощным процессором для работы.',
    price: 45990,
    image: 'https://cdn.pixabay.com/photo/2014/09/24/14/29/ipad-459183_640.jpg',
  },
];

@Injectable()
export class ProductsSeeder implements OnModuleInit {
  private readonly logger = new Logger(ProductsSeeder.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const count = await this.productsRepository.count();
    
    if (count > 0) {
      this.logger.log('Products already seeded, skipping...');
      return;
    }

    this.logger.log('Seeding products...');
    
    for (const productData of INITIAL_PRODUCTS) {
      const product = this.productsRepository.create(productData);
      await this.productsRepository.save(product);
    }

    this.logger.log(`Seeded ${INITIAL_PRODUCTS.length} products`);
  }
}
