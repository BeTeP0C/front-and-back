# TechStore — Интернет-магазин электроники

Полнофункциональное веб-приложение интернет-магазина электроники, разработанное в рамках практических занятий по дисциплине "Фронтенд и бэкенд разработка".

## 📋 Описание проекта

Проект представляет собой SPA-приложение с клиент-серверной архитектурой:
- **Frontend**: React + Vite + SCSS
- **Backend**: Node.js + Express.js
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
- nanoid (генерация ID)
- cors (CORS middleware)
- swagger-jsdoc + swagger-ui-express (документация API)

## 📁 Структура проекта

```
front-and-back/
├── server/                     # Backend
│   ├── app.js                  # Главный файл сервера с Swagger
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

| Метод | Путь | Описание |
|-------|------|----------|
| GET | `/api/products` | Получить все товары |
| GET | `/api/products/:id` | Получить товар по ID |
| POST | `/api/products` | Создать новый товар |
| PATCH | `/api/products/:id` | Обновить товар |
| DELETE | `/api/products/:id` | Удалить товар |

### Структура объекта товара (Product)

```json
{
  "id": "abc123",
  "name": "Умные часы Premium",
  "category": "Часы",
  "description": "Стильные умные часы с AMOLED дисплеем",
  "price": 12990,
  "stock": 15,
  "image": "https://example.com/watch.jpg"
}
```

## ✨ Функциональность

### Карточка товара
- Название товара
- Категория
- Описание
- Цена
- Количество на складе
- Изображение (с заглушкой при ошибке загрузки)
- Индикатор наличия (бейдж)

### CRUD операции
- ✅ Просмотр списка товаров (12 товаров по умолчанию)
- ✅ Добавление нового товара через модальное окно
- ✅ Редактирование товара
- ✅ Удаление товара с подтверждением

### UI/UX
- Адаптивный дизайн
- Тёмная тема
- Анимации и hover-эффекты
- Модальные окна с блокировкой скролла
- Превью изображения при редактировании

## 📖 Swagger документация

Интерактивная документация API доступна по адресу: http://localhost:3000/api-docs

Возможности:
- Просмотр всех эндпоинтов
- Описание параметров и ответов
- Тестирование запросов в браузере (Try it out)

## 🧪 Тестирование API

### Получить все товары
```bash
curl http://localhost:3000/api/products
```

### Создать товар
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Новый товар","category":"Категория","price":9990,"stock":10}'
```

### Обновить товар
```bash
curl -X PATCH http://localhost:3000/api/products/{id} \
  -H "Content-Type: application/json" \
  -d '{"price":8990}'
```

### Удалить товар
```bash
curl -X DELETE http://localhost:3000/api/products/{id}
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

## 👨‍💻 Автор

Практические занятия по дисциплине "Фронтенд и бэкенд разработка"  
МИРЭА, ИПТИП, 4 семестр, 2025/2026 уч. год

## 📄 Лицензия

MIT
