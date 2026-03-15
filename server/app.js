const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Начальный список товаров
let products = [
    { id: 1, name: 'Умные часы Premium', price: 12990 },
    { id: 2, name: 'Беспроводные наушники', price: 8490 },
    { id: 3, name: 'Камера Polaroid', price: 6390 }
];

// Middleware
app.use(cors());
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Главная страница
app.get('/', (req, res) => {
    res.send('API для управления товарами');
});

// ==========================================
// CRUD операции для товаров
// ==========================================

// CREATE - Добавление нового товара
app.post('/products', (req, res) => {
    const { name, price } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ error: 'Необходимо указать название и стоимость товара' });
    }

    const newProduct = {
        id: Date.now(),
        name,
        price: Number(price)
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// READ - Получение всех товаров
app.get('/products', (req, res) => {
    res.json(products);
});

// READ - Получение товара по id
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);

    if (!product) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    res.json(product);
});

// UPDATE - Редактирование товара по id
app.patch('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id == req.params.id);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    const { name, price } = req.body;

    if (name !== undefined) {
        products[productIndex].name = name;
    }
    if (price !== undefined) {
        products[productIndex].price = Number(price);
    }

    res.json(products[productIndex]);
});

// DELETE - Удаление товара по id
app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id == req.params.id);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    res.json({ message: 'Товар удалён', product: deletedProduct });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
