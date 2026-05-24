# TechStore — Интернет-магазин электроники

Полнофункциональное full-stack приложение с JWT-аутентификацией, RBAC, каталогом
товаров, admin-панелью, PWA, real-time обновлениями через WebSocket, push-уведомлениями,
Redis-кэшированием и контейнерными сценариями деплоя с балансировкой нагрузки.

## Технологии

### Frontend
- Next.js 14 (App Router)
- React 18 + TypeScript
- MobX
- Axios (interceptors + refresh token flow)
- SCSS Modules
- socket.io-client

### Backend
- NestJS 11
- TypeORM
- PostgreSQL / SQLite
- Passport + JWT
- class-validator / class-transformer
- Socket.IO
- web-push (VAPID)
- ioredis (кэш)

### Инфраструктура
- Docker + Docker Compose
- Nginx (load balancer)
- HAProxy (альтернативный балансировщик)
- PostgreSQL + Redis

## Структура проекта

```text
front-and-back/
├── client/                               # Next.js frontend
├── server/                               # NestJS backend
├── deploy/
│   ├── load-balancing/
│   │   ├── nginx/nginx.conf              # Nginx LB config
│   │   └── haproxy/haproxy.cfg           # HAProxy LB config
│   └── cluster/nginx.conf                # Nginx config for cluster stack
├── docker-compose.yml                    # base app stack (client + server + db + redis)
├── docker-compose.load-balancing.yml     # LB test stack (Nginx + HAProxy + 3 backends)
├── docker-compose.cluster.yml            # project cluster stack (Nginx + 3 backends + db + redis)
└── docs/
    └── deployment-cluster.md             # cluster deployment notes
```

## Запуск

### Локально (dev)

```bash
# Установка зависимостей для client и server
npm run install:all

# Backend
npm run dev:server

# Frontend
npm run dev:client
```

### Docker (базовый стек приложения)

```bash
docker compose up --build
```

Сервисы:
- `client` → `http://localhost:3000`
- `server` → `http://localhost:4000`
- `swagger` → `http://localhost:4000/api-docs`
- `postgres` → `localhost:5432`
- `redis` → `localhost:6379`

### Docker (стенд балансировки нагрузки)

```bash
npm run lb:up
```

Остановка:

```bash
npm run lb:down
```

Доступ:
- Nginx LB: `http://localhost:8080`
- HAProxy LB: `http://localhost:8081`

### Docker (кластерный деплой)

```bash
npm run cluster:up
```

Остановка:

```bash
npm run cluster:down
```

Доступ:
- Nginx gateway: `http://localhost`
- direct backend ports: `4101`, `4102`, `4103`

## API Endpoints

### Аутентификация

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| POST | `/api/auth/register` | все | Регистрация |
| POST | `/api/auth/login` | все | Вход (access + refresh) |
| POST | `/api/auth/refresh` | все | Обновление токенов |
| POST | `/api/auth/logout` | все | Logout + отзыв refresh |
| GET | `/api/auth/me` | user, admin | Текущий пользователь |

### Товары

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| GET | `/api/products` | все | Список товаров (`category`, `search`) |
| GET | `/api/products/:id` | все | Товар по ID |
| POST | `/api/products` | admin | Создать товар |
| PUT | `/api/products/:id` | admin | Обновить товар |
| DELETE | `/api/products/:id` | admin | Удалить товар |

### Пользователи (CRUD)

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| POST | `/api/users` | все | Создать пользователя |
| GET | `/api/users` | все | Получить список пользователей |
| GET | `/api/users/:id` | все | Получить пользователя по ID |
| PATCH | `/api/users/:id` | все | Обновить пользователя |
| DELETE | `/api/users/:id` | все | Удалить пользователя |

### Admin

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| GET | `/api/admin/users` | admin | Список всех пользователей |
| PATCH | `/api/admin/users/:id/role` | admin | Изменить роль |

### Push и Reminders

| Метод | Путь | Доступ | Описание |
|---|---|---|---|
| GET | `/api/push/vapid-key` | все | Публичный VAPID ключ |
| POST | `/api/push/subscribe` | user, admin | Подписка на push |
| POST | `/api/push/unsubscribe` | user, admin | Отписка от push |
| POST | `/api/push/test` | admin | Тестовый push |
| POST | `/api/reminders/schedule` | admin | Запланировать уведомление |
| POST | `/api/reminders/snooze` | все | Отложить на 5 минут |
| GET | `/api/reminders` | admin | Активные напоминания |
| DELETE | `/api/reminders/:id` | admin | Отменить напоминание |

### System / Health

| Метод | Путь | Описание |
|---|---|---|
| GET | `/` | Базовый ответ API с `instanceId` |
| GET | `/api/system/instance` | Диагностика инстанса |
| GET | `/api/system/health` | Health endpoint для балансировщиков |

## Кэширование Redis

Кэширование реализовано на backend через `RedisCacheService`.

- `GET /api/users` — TTL `60s`
- `GET /api/users/:id` — TTL `60s`
- `GET /api/products` — TTL `600s`
- `GET /api/products/:id` — TTL `600s`

Инвалидация:
- Users кэш очищается при `POST/PATCH/DELETE /api/users`
- Products кэш очищается при `POST/PUT/DELETE /api/products`

Если Redis недоступен, API продолжает работать напрямую с БД (graceful degradation).

## Балансировка нагрузки

- Nginx upstream с primary + backup стратегией:
  - primary: `backend1`, `backend2`
  - backup: `backend3`
  - параметры отказоустойчивости: `max_fails=2`, `fail_timeout=30s`
- HAProxy как альтернативный LB с health checks.

Конфиги:
- `deploy/load-balancing/nginx/nginx.conf`
- `deploy/load-balancing/haproxy/haproxy.cfg`
- `deploy/cluster/nginx.conf`

## Лицензия

MIT
