# TechStore — Интернет-магазин электроники

Полнофункциональное веб-приложение интернет-магазина электроники с аутентификацией пользователей, разработанное в рамках практических занятий по дисциплине "Фронтенд и бэкенд разработка".

## 📋 Описание проекта

Проект представляет собой SPA-приложение с клиент-серверной архитектурой:
- **Frontend**: React + Vite + SCSS
- **Backend**: Node.js + Express.js
- **Аутентификация**: bcrypt (хеширование паролей с солью)
- **Документация API**: Swagger (OpenAPI 3.0)

## 🛠 Технологии

### Frontend
- React 18
- Vite 5
- SCSS (с переменными и миксинами)
- Axios (HTTP-клиент)

### Backend
- Node.js
- Express.js
- bcrypt (хеширование паролей)
- nanoid (генерация ID)
- cors (CORS middleware)
- swagger-jsdoc + swagger-ui-express (документация API)

## 📁 Структура проекта

```
front-and-back/
├── server/                     # Backend
│   ├── app.js                  # Главный файл сервера
│   ├── package.json
│   └── node_modules/
├── src/                        # Frontend
│   ├── api/
│   │   └── index.js            # API клиент (axios)
│   ├── components/
│   │   ├── Badge/              # Компонент бейджа
│   │   ├── Button/             # Компонент кнопки
│   │   ├── ConfirmModal/       # Модалка подтверждения удаления
│   │   ├── ProductCard/        # Карточка товара
│   │   └── ProductModal/       # Модалка создания/редактирования
│   ├── styles/
│   │   ├── _variables.scss     # SCSS переменные
│   │   ├── _mixins.scss        # SCSS миксины
│   │   └── global.scss         # Глобальные стили
│   ├── App.jsx                 # Главный компонент
│   ├── App.scss
│   └── main.jsx                # Точка входа
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Установка и запуск

### 1. Клонирование репозитория
```bash
git clone <url-репозитория>
cd front-and-back
```

### 2. Установка зависимостей

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Запуск приложения

**Backend (порт 3000):**
```bash
cd server
node app.js
```

**Frontend (порт 5173):**
```bash
npm run dev
```

### 4. Открытие в браузере
- **Приложение**: http://localhost:5173
- **Swagger UI**: http://localhost:3000/api-docs

## 📡 API Endpoints

### Аутентификация (Auth)

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/auth/register` | Регистрация пользователя |
| POST | `/api/auth/login` | Вход в систему |

### Товары (Products)

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/products` | Получить список товаров |
| GET | `/api/products/:id` | Получить товар по ID |
| POST | `/api/products` | Создать товар |
| PUT | `/api/products/:id` | Обновить параметры товара |
| DELETE | `/api/products/:id` | Удалить товар |

### Структура сущности "Пользователь" (User)

```json
{
  "id": "abc123",
  "email": "ivan@example.com",
  "first_name": "Иван",
  "last_name": "Петров",
  "password": "$2b$10$..." // хешированный bcrypt
}
```

### Структура сущности "Товар" (Product)

```json
{
  "id": "xyz789",
  "title": "Умные часы Premium",
  "category": "Часы",
  "description": "Стильные умные часы с AMOLED дисплеем",
  "price": 12990,
  "image": "https://example.com/watch.jpg"
}
```

## 🔐 Аутентификация

### Хеширование паролей (bcrypt)

Пароли хешируются с использованием алгоритма bcrypt с солью:

```javascript
const bcrypt = require('bcrypt');

// Хеширование
async function hashPassword(password) {
    const rounds = 10;
    return bcrypt.hash(password, rounds);
}

// Проверка
async function verifyPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}
```

### Пример регистрации

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"ivan@example.com","first_name":"Иван","last_name":"Петров","password":"qwerty123"}'
```

### Пример входа

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ivan@example.com","password":"qwerty123"}'
```

## ✨ Функциональность

### Карточка товара
- Название (title)
- Категория
- Описание
- Цена
- Изображение (с заглушкой при ошибке загрузки)

### CRUD операции
- ✅ Просмотр списка товаров (12 товаров по умолчанию)
- ✅ Добавление нового товара
- ✅ Редактирование товара
- ✅ Удаление товара с подтверждением

### Аутентификация
- ✅ Регистрация с хешированием пароля (bcrypt)
- ✅ Вход с проверкой пароля
- ✅ Защита от дублирования email

### UI/UX
- Адаптивный дизайн
- Тёмная тема
- Анимации и hover-эффекты
- Модальные окна с блокировкой скролла

## 📖 Swagger документация

Интерактивная документация API доступна по адресу: http://localhost:3000/api-docs

Возможности:
- Просмотр всех эндпоинтов (Auth + Products)
- Описание параметров и ответов
- Тестирование запросов в браузере (Try it out)

## 🧪 Тестирование API

### Регистрация пользователя
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","first_name":"Test","last_name":"User","password":"password123"}'
```

### Вход в систему
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Получить все товары
```bash
curl http://localhost:3000/api/products
```

### Создать товар
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"title":"Новый товар","category":"Категория","description":"Описание","price":9990}'
```

## 📚 Выполненные практические занятия

### Практическое занятие №1
- Реализация карточки товара на SCSS
- Использование переменных и миксинов
- Вложенная структура селекторов (BEM)

### Практическое занятие №2
- Создание сервера на Node.js + Express
- Реализация REST API с CRUD операциями
- Middleware для логирования и CORS

### Практическое занятие №4
- Интеграция React-клиента с Express-сервером
- Использование axios для HTTP-запросов
- Полноценный интернет-магазин с 10+ товарами

### Практическое занятие №5
- Подключение Swagger (swagger-jsdoc, swagger-ui-express)
- JSDoc-аннотации для документирования API
- Интерактивная документация по адресу /api-docs

### Практическое занятие №7
- Аутентификация пользователей
- Хеширование паролей с bcrypt + соль
- Маршруты /api/auth/register и /api/auth/login
- Сущность User с полями: id, email, first_name, last_name, password

## 👨‍💻 Автор

Практические занятия по дисциплине "Фронтенд и бэкенд разработка"  
МИРЭА, ИПТИП, 4 семестр, 2025/2026 уч. год

## 📄 Лицензия

MIT
