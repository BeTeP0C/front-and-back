const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

// Подключаем Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

// ==========================================
// ДАННЫЕ
// ==========================================

// Пользователи
let users = [];

// Товары (10+ штук) - тематика: электроника
let products = [
    { id: nanoid(6), title: 'Умные часы Premium', category: 'Часы', description: 'Стильные умные часы с AMOLED дисплеем, мониторингом здоровья и водозащитой IP68.', price: 12990, image: 'https://cdn.pixabay.com/photo/2015/06/25/17/22/smart-watch-821565_640.jpg' },
    { id: nanoid(6), title: 'Беспроводные наушники Pro', category: 'Аудио', description: 'Наушники с активным шумоподавлением и кристально чистым звуком. До 30 часов работы.', price: 8490, image: 'https://cdn.pixabay.com/photo/2018/09/17/14/27/headphones-3683983_640.jpg' },
    { id: nanoid(6), title: 'Камера Polaroid Mini', category: 'Фото', description: 'Ретро-камера для мгновенных снимков. Встроенная вспышка и автоматическая экспозиция.', price: 6390, image: 'https://cdn.pixabay.com/photo/2014/08/05/10/31/polaroid-410681_640.jpg' },
    { id: nanoid(6), title: 'Смартфон Galaxy X', category: 'Смартфоны', description: 'Флагманский смартфон с 6.7" экраном, камерой 108 МП и процессором нового поколения.', price: 79990, image: 'https://cdn.pixabay.com/photo/2016/11/29/05/08/smartphone-1867467_640.jpg' },
    { id: nanoid(6), title: 'Портативная колонка Boom', category: 'Аудио', description: 'Мощная Bluetooth-колонка с глубокими басами. Защита от воды IPX7.', price: 4990, image: 'https://cdn.pixabay.com/photo/2017/08/09/15/45/speaker-2614558_640.jpg' },
    { id: nanoid(6), title: 'Фитнес-браслет Active', category: 'Часы', description: 'Легкий фитнес-трекер с пульсометром, шагомером и уведомлениями. Батарея на 14 дней.', price: 2990, image: 'https://cdn.pixabay.com/photo/2021/01/06/07/52/smart-watch-5893906_640.jpg' },
    { id: nanoid(6), title: 'Ноутбук ProBook 15', category: 'Компьютеры', description: 'Производительный ноутбук с Intel Core i7, 16 ГБ RAM и SSD 512 ГБ.', price: 89990, image: 'https://cdn.pixabay.com/photo/2016/03/27/07/12/apple-1282241_640.jpg' },
    { id: nanoid(6), title: 'Игровая мышь Viper', category: 'Аксессуары', description: 'Игровая мышь с сенсором 16000 DPI, RGB подсветкой и 8 программируемыми кнопками.', price: 3490, image: 'https://cdn.pixabay.com/photo/2017/05/24/21/33/workplace-2341642_640.jpg' },
    { id: nanoid(6), title: 'Механическая клавиатура TKL', category: 'Аксессуары', description: 'Компактная механическая клавиатура с Cherry MX переключателями и RGB подсветкой.', price: 7990, image: 'https://cdn.pixabay.com/photo/2015/05/26/23/52/technology-785742_640.jpg' },
    { id: nanoid(6), title: 'Внешний SSD 1TB', category: 'Накопители', description: 'Быстрый внешний SSD накопитель с интерфейсом USB-C. Скорость до 1050 МБ/с.', price: 8990, image: 'https://cdn.pixabay.com/photo/2017/03/21/21/53/hard-disk-2163766_640.jpg' },
    { id: nanoid(6), title: 'Веб-камера 4K Pro', category: 'Аксессуары', description: 'Профессиональная веб-камера с разрешением 4K, автофокусом и встроенным микрофоном.', price: 9990, image: 'https://cdn.pixabay.com/photo/2020/04/14/11/55/webcam-5042320_640.jpg' },
    { id: nanoid(6), title: 'Планшет Tab S8', category: 'Планшеты', description: 'Планшет с 11" IPS экраном, стилусом в комплекте и мощным процессором для работы.', price: 45990, image: 'https://cdn.pixabay.com/photo/2014/09/24/14/29/ipad-459183_640.jpg' }
];

// ==========================================
// SWAGGER КОНФИГУРАЦИЯ
// ==========================================

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API интернет-магазина с авторизацией',
            version: '1.0.0',
            description: 'REST API для управления товарами и пользователями с bcrypt аутентификацией',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Логирование запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// ==========================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================

// Хеширование пароля
async function hashPassword(password) {
    const rounds = 10;
    return bcrypt.hash(password, rounds);
}

// Проверка пароля
async function verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}

// Поиск пользователя по email
function findUserByEmail(email) {
    return users.find(u => u.email === email);
}

// Поиск товара или 404
function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Товар не найден" });
        return null;
    }
    return product;
}

// ==========================================
// SWAGGER СХЕМЫ
// ==========================================

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - first_name
 *         - last_name
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID пользователя
 *         email:
 *           type: string
 *           format: email
 *           description: Email пользователя (используется как логин)
 *         first_name:
 *           type: string
 *           description: Имя пользователя
 *         last_name:
 *           type: string
 *           description: Фамилия пользователя
 *       example:
 *         id: "abc123"
 *         email: "ivan@example.com"
 *         first_name: "Иван"
 *         last_name: "Петров"
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: Уникальный ID товара
 *         title:
 *           type: string
 *           description: Название товара
 *         category:
 *           type: string
 *           description: Категория товара
 *         description:
 *           type: string
 *           description: Описание товара
 *         price:
 *           type: number
 *           description: Цена товара в рублях
 *         image:
 *           type: string
 *           description: URL изображения товара
 *       example:
 *         id: "xyz789"
 *         title: "Умные часы Premium"
 *         category: "Часы"
 *         description: "Стильные умные часы с AMOLED дисплеем"
 *         price: 12990
 *         image: "https://example.com/watch.jpg"
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Сообщение об ошибке
 */

// ==========================================
// МАРШРУТЫ
// ==========================================

// Главная страница
app.get('/', (req, res) => {
    res.send('API интернет-магазина с авторизацией. Документация: <a href="/api-docs">/api-docs</a>');
});

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Аутентификация пользователей
 *   - name: Products
 *     description: Управление товарами
 */

// ==========================================
// AUTH - Аутентификация
// ==========================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация пользователя
 *     description: Создает нового пользователя с хешированным паролем (bcrypt)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - first_name
 *               - last_name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ivan@example.com
 *               first_name:
 *                 type: string
 *                 example: Иван
 *               last_name:
 *                 type: string
 *                 example: Петров
 *               password:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *       400:
 *         description: Некорректные данные или пользователь уже существует
 */
app.post("/api/auth/register", async (req, res) => {
    const { email, first_name, last_name, password } = req.body;

    // Валидация
    if (!email || !first_name || !last_name || !password) {
        return res.status(400).json({ error: "Все поля обязательны: email, first_name, last_name, password" });
    }

    // Проверка существования пользователя
    if (findUserByEmail(email)) {
        return res.status(400).json({ error: "Пользователь с таким email уже существует" });
    }

    // Создание пользователя
    const newUser = {
        id: nanoid(6),
        email: email.trim().toLowerCase(),
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        password: await hashPassword(password)
    };

    users.push(newUser);

    // Возвращаем без пароля
    res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name
    });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход в систему
 *     description: Проверяет email и пароль пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ivan@example.com
 *               password:
 *                 type: string
 *                 example: qwerty123
 *     responses:
 *       200:
 *         description: Успешная авторизация
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *       400:
 *         description: Отсутствуют обязательные поля
 *       401:
 *         description: Неверный пароль
 *       404:
 *         description: Пользователь не найден
 */
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
        return res.status(400).json({ error: "Email и пароль обязательны" });
    }

    // Поиск пользователя
    const user = findUserByEmail(email.trim().toLowerCase());
    if (!user) {
        return res.status(404).json({ error: "Пользователь не найден" });
    }

    // Проверка пароля
    const isAuthenticated = await verifyPassword(password, user.password);
    if (!isAuthenticated) {
        return res.status(401).json({ error: "Неверный пароль" });
    }

    // Успешная авторизация
    res.status(200).json({
        success: true,
        user: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name
        }
    });
});

// ==========================================
// PRODUCTS - Товары
// ==========================================

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Создать товар
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Товар создан
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Ошибка валидации
 */
app.post('/api/products', (req, res) => {
    const { title, category, description, price, image } = req.body;

    if (!title || !category || price === undefined) {
        return res.status(400).json({ error: 'Необходимо указать title, category и price' });
    }

    const newProduct = {
        id: nanoid(6),
        title: title.trim(),
        category: category.trim(),
        description: description?.trim() || '',
        price: Number(price),
        image: image?.trim() || ''
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Получить список товаров
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Список товаров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
app.get('/api/products', (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Получить товар по ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       200:
 *         description: Данные товара
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.get('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Обновить параметры товара
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обновленный товар
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Товар не найден
 */
app.put('/api/products/:id', (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    const { title, category, description, price, image } = req.body;

    if (title !== undefined) product.title = title.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);
    if (image !== undefined) product.image = image.trim();

    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Удалить товар
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID товара
 *     responses:
 *       204:
 *         description: Товар удален
 *       404:
 *         description: Товар не найден
 */
app.delete('/api/products/:id', (req, res) => {
    const exists = products.some(p => p.id === req.params.id);
    if (!exists) {
        return res.status(404).json({ error: "Товар не найден" });
    }

    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

// ==========================================
// ОБРАБОТКА ОШИБОК
// ==========================================

// 404 для остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Маршрут не найден" });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

// ==========================================
// ЗАПУСК СЕРВЕРА
// ==========================================

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
    console.log(`Swagger UI доступен по адресу http://localhost:${port}/api-docs`);
});
