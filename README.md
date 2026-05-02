# TechStore — Интернет-магазин электроники

Полнофункциональное веб-приложение интернет-магазина электроники с JWT-аутентификацией, ролевой моделью (RBAC), админ-панелью, PWA (offline-first, установка на устройство), real-time обновлениями через WebSocket (Socket.IO) и push-уведомлениями (VAPID). Разработано в рамках практических занятий по дисциплине "Фронтенд и бэкенд разработка".

## Технологии

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- MobX (стейт-менеджмент)
- Axios (HTTP-клиент с interceptors)
- SCSS Modules
- socket.io-client (real-time обновления)

### Backend
- NestJS 11
- TypeORM (SQLite для dev / PostgreSQL для production)
- Passport + passport-jwt (JWT-аутентификация)
- bcrypt (хеширование паролей)
- Swagger (OpenAPI документация)
- class-validator / class-transformer (валидация DTO)
- Socket.IO / @nestjs/websockets (WebSocket gateway)
- web-push (VAPID push-уведомления)

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
│   │       ├── products/           # CRUD товаров + emit WS/push
│   │       ├── admin/              # Управление пользователями (RBAC)
│   │       ├── events/             # EventsGateway (Socket.IO WebSocket)
│   │       ├── push/               # PushService, PushController, PushSubscription entity
│   │       └── reminders/          # Отложенные уведомления (in-memory scheduling)
│   └── Dockerfile
└── client/                         # Next.js Frontend
    ├── src/
    │   ├── api/                    # client.ts, auth.ts, products.ts, admin.ts, socket.ts, push.ts
    │   ├── app/
    │   │   ├── page.tsx            # Главная (каталог товаров, скелетоны)
    │   │   ├── admin/page.tsx      # Админ-панель (управление пользователями)
    │   │   ├── products/[id]/      # Страница деталки товара
    │   │   └── manifest.ts         # PWA-манифест (Next.js Metadata API)
    │   ├── components/
    │   │   ├── AuthForm/           # Форма входа/регистрации
    │   │   ├── Header/             # Шапка с навигацией
    │   │   ├── ProductCard/        # Карточка товара (клик → деталка)
    │   │   ├── ProductModal/       # Модалка создания/редактирования
    │   │   ├── ConfirmModal/       # Модалка подтверждения
    │   │   ├── Spinner/            # Переиспользуемый спиннер загрузки
    │   │   ├── SkeletonCard/       # Скелетон карточки товара (shimmer)
    │   │   ├── SocketProvider/     # Подключение socket.io-client, WS-события
    │   │   ├── PushNotifications/  # Выпадающее меню уведомлений
    │   │   ├── ServiceWorker/      # Регистрация Service Worker
    │   │   ├── NetworkStatus/      # Индикатор онлайн/оффлайн
    │   │   └── InstallPWA/         # Кнопка установки PWA
    │   ├── stores/                 # MobX: authStore, productsStore
    │   └── types/                  # TypeScript интерфейсы
    ├── public/
    │   ├── sw.js                   # Service Worker (кэширование, offline, push, notificationclick)
    │   ├── offline.html            # Fallback-страница без сети
    │   └── icons/                  # PWA-иконки (72–512px + apple-touch-icon)
    └── Dockerfile
```

## Запуск

### Локально (dev)

```bash
# Установка зависимостей
npm run install:all

# Генерация VAPID-ключей (один раз)
cd server && npm run vapid
# Скопировать ключи в server/.env:
# VAPID_PUBLIC_KEY=...
# VAPID_PRIVATE_KEY=...

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
| server | 4000 | NestJS API + WebSocket |
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
| POST | `/api/products` | admin | Создать товар (+ WS emit + push) |
| PUT | `/api/products/:id` | admin | Обновить товар (+ WS emit + push) |
| DELETE | `/api/products/:id` | admin | Удалить товар (+ WS emit + push) |

### Админ-панель

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/api/admin/users` | admin | Список всех пользователей |
| PATCH | `/api/admin/users/:id/role` | admin | Изменить роль (нельзя себе) |

### Push-уведомления

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/api/push/vapid-key` | все | Получить VAPID public key |
| POST | `/api/push/subscribe` | user, admin | Подписаться на push |
| POST | `/api/push/unsubscribe` | user, admin | Отписаться от push |
| POST | `/api/push/test` | admin | Отправить тестовый push всем |

### Отложенные уведомления (Reminders)

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| POST | `/api/reminders/schedule` | admin | Запланировать push через N секунд |
| POST | `/api/reminders/snooze` | все | Отложить уведомление на 5 минут |
| GET | `/api/reminders` | admin | Список активных напоминаний |
| DELETE | `/api/reminders/:id` | admin | Отменить напоминание |

### WebSocket события (Socket.IO)

| Событие | Направление | Описание |
|---------|-------------|----------|
| `product:created` | сервер → клиент | Новый товар создан |
| `product:updated` | сервер → клиент | Товар обновлён |
| `product:deleted` | сервер → клиент | Товар удалён |

## Ролевая модель (RBAC)

Две роли: `user` и `admin`.

- **user** — просмотр каталога товаров, подписка на push-уведомления
- **admin** — полный CRUD товаров + управление пользователями + тестовый push

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

### ПР 13-14: PWA, Service Worker, Manifest, Offline-first
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

### ПР 15-16: WebSocket + Push Notifications
- **WebSocket (Socket.IO)** — real-time обновления товаров:
  - `EventsGateway` (NestJS) — эмит событий при CRUD товаров
  - `SocketProvider` (React) — подключение к серверу, обновление MobX стора без перезагрузки
  - Все клиенты мгновенно видят изменения каталога
- **Web Push Notifications (VAPID)**:
  - `PushService` + `PushController` — подписки хранятся в БД (TypeORM entity)
  - VAPID-ключи через env-переменные
  - Push при создании/обновлении/удалении товара с deep-link на страницу товара
  - Dropdown-меню уведомлений в Header (подписка/отписка, тестовый push для admin)
  - Service Worker: обработчики `push` + `notificationclick` с навигацией к товару
- **UX-улучшения**:
  - Компонент `Spinner` — анимированный спиннер загрузки
  - Компонент `SkeletonCard` — shimmer-скелетоны карточек товаров
  - Страница деталки товара `/products/[id]`
  - Карточки товаров кликабельны — переход к деталке
  - Loading-состояния на всех страницах

### ПР 17: Отложенные Push-уведомления
- **Server-side scheduling** — `RemindersModule` (NestJS):
  - `RemindersService` хранит напоминания в `Map` (in-memory), планирует отправку через `setTimeout`
  - Endpoints: `POST /api/reminders/schedule` (задержка 5–3600 сек), `POST /api/reminders/snooze` (перепланирование на 5 мин), `GET /api/reminders`, `DELETE /api/reminders/:id`
  - При срабатывании таймера вызывается `PushService.sendToAll` с передачей `reminderId` в payload
- **Service Worker — action "Отложить на 5 мин"**:
  - Уведомления от напоминаний содержат action `snooze_5m`
  - При нажатии "Отложить" SW отправляет `POST /api/reminders/snooze` на бэкенд
  - Уведомление приходит повторно через 5 минут
- **Frontend — UI планирования**:
  - Форма в dropdown уведомлений: заголовок, текст, задержка в секундах
  - Список активных напоминаний с обратным отсчётом и кнопкой отмены
  - API-функции: `scheduleReminder`, `getReminders`, `cancelReminder`

## Автор

Практические занятия по дисциплине "Фронтенд и бэкенд разработка"
МИРЭА, ИПТИП, 4 семестр, 2025/2026 уч. год

## Лицензия

MIT
