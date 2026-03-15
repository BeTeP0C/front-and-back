const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

// Начальный список товаров (10+ штук) - тематика: электроника
let products = [
    { id: nanoid(6), name: 'Умные часы Premium', category: 'Часы', description: 'Стильные умные часы с AMOLED дисплеем, мониторингом здоровья и водозащитой IP68.', price: 12990, stock: 15, image: 'https://cdn.pixabay.com/photo/2015/06/25/17/22/smart-watch-821565_640.jpg' },
    { id: nanoid(6), name: 'Беспроводные наушники Pro', category: 'Аудио', description: 'Наушники с активным шумоподавлением и кристально чистым звуком. До 30 часов работы.', price: 8490, stock: 25, image: 'https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_640.jpg' },
    { id: nanoid(6), name: 'Камера Polaroid Mini', category: 'Фото', description: 'Ретро-камера для мгновенных снимков. Встроенная вспышка и автоматическая экспозиция.', price: 6390, stock: 8, image: 'https://cdn.pixabay.com/photo/2014/08/05/10/31/polaroid-410681_640.jpg' },
    { id: nanoid(6), name: 'Смартфон Galaxy X', category: 'Смартфоны', description: 'Флагманский смартфон с 6.7" экраном, камерой 108 МП и процессором нового поколения.', price: 79990, stock: 12, image: 'https://cdn.pixabay.com/photo/2016/11/29/05/08/smartphone-1867467_640.jpg' },
    { id: nanoid(6), name: 'Портативная колонка Boom', category: 'Аудио', description: 'Мощная Bluetooth-колонка с глубокими басами. Защита от воды IPX7.', price: 4990, stock: 30, image: 'https://cdn.pixabay.com/photo/2017/08/09/15/45/speaker-2614558_640.jpg' },
    { id: nanoid(6), name: 'Фитнес-браслет Active', category: 'Часы', description: 'Легкий фитнес-трекер с пульсометром, шагомером и уведомлениями. Батарея на 14 дней.', price: 2990, stock: 50, image: 'https://cdn.pixabay.com/photo/2021/01/06/07/52/smart-watch-5893906_640.jpg' },
    { id: nanoid(6), name: 'Ноутбук ProBook 15', category: 'Компьютеры', description: 'Производительный ноутбук с Intel Core i7, 16 ГБ RAM и SSD 512 ГБ.', price: 89990, stock: 7, image: 'https://cdn.pixabay.com/photo/2016/03/27/07/12/apple-1282241_640.jpg' },
    { id: nanoid(6), name: 'Игровая мышь Viper', category: 'Аксессуары', description: 'Игровая мышь с сенсором 16000 DPI, RGB подсветкой и 8 программируемыми кнопками.', price: 3490, stock: 40, image: 'https://cdn.pixabay.com/photo/2017/05/24/21/33/workplace-2341642_640.jpg' },
    { id: nanoid(6), name: 'Механическая клавиатура TKL', category: 'Аксессуары', description: 'Компактная механическая клавиатура с Cherry MX переключателями и RGB подсветкой.', price: 7990, stock: 18, image: 'https://cdn.pixabay.com/photo/2015/05/26/23/52/technology-785742_640.jpg' },
    { id: nanoid(6), name: 'Внешний SSD 1TB', category: 'Накопители', description: 'Быстрый внешний SSD накопитель с интерфейсом USB-C. Скорость до 1050 МБ/с.', price: 8990, stock: 22, image: 'https://cdn.pixabay.com/photo/2017/03/21/21/53/hard-disk-2163766_640.jpg' },
    { id: nanoid(6), name: 'Веб-камера 4K Pro', category: 'Аксессуары', description: 'Профессиональная веб-камера с разрешением 4K, автофокусом и встроенным микрофоном.', price: 9990, stock: 14, image: 'https://cdn.pixabay.com/photo/2020/04/14/11/55/webcam-5042320_640.jpg' },
    { id: nanoid(6), name: 'Планшет Tab S8', category: 'Планшеты', description: 'Планшет с 11" IPS экраном, стилусом в комплекте и мощным процессором для работы.', price: 45990, stock: 9, image: 'https://cdn.pixabay.com/photo/2014/09/24/14/29/ipad-459183_640.jpg' }
];

// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Функция-помощник для поиска товара
function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Товар не найден" });
        return null;
    }
    return product;
}

// Главная страница
app.get('/', (req, res) => {
    res.send('API интернет-магазина электроники');
});

// ==========================================
// CRUD операции для товаров
// ==========================================

// CREATE - Добавление нового товара
app.post('/api/products', (req, res) => {
    const { name, category, description, price, stock, image } = req.body;

    if (!name || !category || price === undefined) {
        return res.status(400).json({ error: 'Необходимо указать название, категорию и цену товара' });
    }

    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description?.trim() || '',
        price: Number(price),
        stock: Number(stock) || 0,
        image: image?.trim() || ''
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// READ - Получение всех товаров
app.get('/api/products', (req, res) => {
    res.json(products);
});

// READ - Получение товара по id
app.get('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    res.json(product);
});

// UPDATE - Редактирование товара по id
app.patch('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    const { name, category, description, price, stock, image } = req.body;

    // Проверка что есть хотя бы одно поле для обновления
    if (name === undefined && category === undefined && description === undefined && price === undefined && stock === undefined && image === undefined) {
        return res.status(400).json({ error: "Нечего обновлять" });
    }

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (image !== undefined) product.image = image.trim();

    res.json(product);
});

// DELETE - Удаление товара по id
app.delete('/api/products/:id', (req, res) => {
    const exists = products.some(p => p.id === req.params.id);
    if (!exists) {
        return res.status(404).json({ error: "Товар не найден" });
    }

    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

// 404 для остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Маршрут не найден" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
