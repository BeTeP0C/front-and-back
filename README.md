# TechStore — Интернет-магазин электроники

Полнофункциональное веб-приложение интернет-магазина электроники с JWT-аутентификацией, ролевой моделью (RBAC), админ-панелью и поддержкой PWA (offline-first, установка на устройство). Разработано в рамках практических занятий по дисциплине "Фронтенд и бэкенд разработка".

## Технологии

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- MobX (стейт-менеджмент)
- Axios (HTTP-клиент с interceptors)
- SCSS Modules

### Backend
- NestJS 11
- TypeORM (SQLite для dev / PostgreSQL для production)
- Passport + passport-jwt (JWT-аутентификация)
- bcrypt (хеширование паролей)
- Swagger (OpenAPI документация)
- class-validator / class-transformer (валидация DTO)

### Инфраструктура
- Docker + Docker Compose (PostgreSQL, Redis, server, client)
- Multi-stage Dockerfile для обоих приложений

## Структура проекта

```
front-and-back/
├── docker-compose.yml
├── package.json
├── server/                         # NestJS Backend
│   ├── src/
│   │   ├── main.ts                 # Bootstrap: CORS, Swagger, ValidationPipe
│   │   ├── app.module.ts
│   │   ├── config/                 # database, jwt, redis конфиги
│   │   ├── common/
│   │   │   ├── decorators/         # @CurrentUser(), @Roles()
│   │   │   ├── guards/             # RolesGuard (RBAC)
│   │   │   ├── filters/            # HttpExceptionFilter
│   │   │   └── types/              # JwtPayload, ApiResponse
│   │   ├── database/
│   │   │   └── seeds/              # ProductsSeeder, AdminSeeder
│   │   └── modules/
│   │       ├── auth/               # register, login, refresh, logout, me
│   │       ├── users/              # User entity + service
│   │       ├── products/           # CRUD товаров
│   │       └── admin/              # Управление пользователями (RBAC)
│   └── Dockerfile
└── client/                         # Next.js Frontend
    ├── src/
    │   ├── api/                    # client.ts, auth.ts, products.ts, admin.ts
    │   ├── app/
    │   │   ├── page.tsx            # Главная (каталог товаров)
    │   │   ├── admin/page.tsx      # Админ-панель (управление пользователями)
    │   │   └── manifest.ts         # PWA-манифест (Next.js Metadata API)
    │   ├── components/
    │   │   ├── AuthForm/           # Форма входа/регистрации
    │   │   ├── Header/             # Шапка с навигацией
    │   │   ├── ProductCard/        # Карточка товара
    │   │   ├── ProductModal/       # Модалка создания/редактирования
    │   │   ├── ConfirmModal/       # Модалка подтверждения
    │   │   ├── ServiceWorker/      # Регистрация Service Worker
    │   │   ├── NetworkStatus/      # Индикатор онлайн/оффлайн
    │   │   └── InstallPWA/         # Кнопка установки PWA
    │   ├── stores/                 # MobX: authStore, productsStore
    │   └── types/                  # TypeScript интерфейсы
    ├── public/
    │   ├── sw.js                   # Service Worker (кэширование, offline)
    │   ├── offline.html            # Fallback-страница без сети
    │   └── icons/                  # PWA-иконки (72–512px + apple-touch-icon)
    └── Dockerfile
```

## Запуск

### Локально (dev)

```bash
# Установка зависимостей
npm run install:all

# Backend (порт 4000, SQLite)
npm run dev:server

# Frontend (порт 3000)
npm run dev:client
```

### Docker

```bash
docker-compose up --build
```

Поднимает 4 контейнера:

| Сервис | Порт | Описание |
|--------|------|----------|
| postgres | 5432 | PostgreSQL 16 |
| redis | 6379 | Redis 7 |
| server | 4000 | NestJS API |
| client | 3000 | Next.js |

### Доступ

- Приложение: http://localhost:3000
- API: http://localhost:4000/api
- Swagger: http://localhost:4000/api-docs
- Админ: `admin@techstore.com` / `admin123`

## API Endpoints

### Аутентификация

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| POST | `/api/auth/register` | все | Регистрация |
| POST | `/api/auth/login` | все | Вход (возвращает access + refresh) |
| POST | `/api/auth/refresh` | все | Обновление пары токенов |
| POST | `/api/auth/logout` | все | Отзыв refresh-токена |
| GET | `/api/auth/me` | user, admin | Текущий пользователь |

### Товары

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/api/products` | все | Список товаров (?category=, ?search=) |
| GET | `/api/products/:id` | все | Товар по ID |
| POST | `/api/products` | admin | Создать товар |
| PUT | `/api/products/:id` | admin | Обновить товар |
| DELETE | `/api/products/:id` | admin | Удалить товар |

### Админ-панель

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/api/admin/users` | admin | Список всех пользователей |
| PATCH | `/api/admin/users/:id/role` | admin | Изменить роль (нельзя себе) |

## Ролевая модель (RBAC)

Две роли: `user` и `admin`.

- **user** — просмотр каталога товаров
- **admin** — полный CRUD товаров + управление пользователями

Реализация:
- `@Roles()` декоратор + `RolesGuard` на бэкенде
- Роль включена в JWT payload (`{ sub, email, role }`)
- Фронтенд скрывает UI-элементы управления для обычных пользователей
- Админ не может изменить свою собственную роль (защита на фронте и бэке)

## Аутентификация

- Пароли хешируются через `bcrypt` (10 раундов)
- Access token (JWT, 15 мин) + Refresh token (JWT, 7 дней)
- Refresh-токены хранятся в `Set` на бэке с ротацией при обновлении
- Axios interceptor автоматически обновляет токены при 401
- Logout отзывает refresh-токен на сервере

## Выполненные практические занятия

### ПР 1-5: Основа проекта
- Карточка товара на SCSS, REST API, интеграция клиент-сервер
- Swagger документация

### ПР 7-8: Аутентификация
- Регистрация/вход, bcrypt, JWT, защищённые маршруты

### ПР 9: Refresh-токены
- Refresh-токены + `POST /api/auth/refresh`

### ПР 10: Фронтенд аутентификации
- Хранение токенов в localStorage, авто-refresh при 401 (axios interceptors)

### ПР 11: Ролевая модель (RBAC)
- Роли admin/user, `@Roles()` декоратор, `RolesGuard`
- Admin API: список пользователей, смена ролей
- Защита товаров: просмотр для всех, изменение только admin
- Страница `/admin` с управлением пользователями
- Logout на бэкенде (отзыв refresh-токена)
- Модалка подтверждения выхода
- Сообщения об ошибках на русском

### ПР 13-14: PWA, Service Worker, Manifest
- `manifest.ts` через Next.js Metadata API (name, icons, display: standalone, theme_color)
- Набор PWA-иконок (72–512px + apple-touch-icon) — генерация через `sharp`
- Ручной Service Worker (`public/sw.js`):
  - **install** — pre-cache статических ресурсов
  - **activate** — удаление старых кэшей
  - **fetch** — Network First для API, Cache First для статики
  - Offline fallback (`offline.html`)
- Компонент `ServiceWorker` — регистрация SW при монтировании
- Компонент `NetworkStatus` — индикатор онлайн/оффлайн (красная плашка при потере сети)
- Компонент `InstallPWA` — кнопка установки для Chromium (`beforeinstallprompt`) + подсказка для Safari
- Мета-теги для iOS: apple-touch-icon, apple-mobile-web-app-capable, theme-color

## Автор

Практические занятия по дисциплине "Фронтенд и бэкенд разработка"
МИРЭА, ИПТИП, 4 семестр, 2025/2026 уч. год

## Лицензия

MIT
