# 🖥️ TechCare — Информационная система сервисного центра

> **Курсовой проект** по дисциплине «Информационные системы»  
> Тема: *Информационная система фирмы по ремонту компьютерной техники*

---

## 📋 О проекте

TechCare — веб-приложение для автоматизации работы сервисного центра по ремонту компьютерной техники. Система позволяет вести учёт клиентов, устройств, заявок на ремонт, сотрудников и услуг, а также просматривать аналитику и экспортировать отчёты.

## 🛠️ Стек технологий

| Слой | Технологии |
|------|-----------|
| **Backend** | C# · ASP.NET Core 8 Web API · Entity Framework Core |
| **Frontend** | TypeScript · React 19 · Vite · Recharts |
| **База данных** | PostgreSQL 16 · Docker |
| **Документация API** | Swagger / OpenAPI |

## 🗂️ Структура базы данных

```
clients         — клиенты сервисного центра
employees       — сотрудники (мастера, менеджеры)
devices         — устройства клиентов
services        — виды услуг с ценами
orders          — заявки на ремонт
order_services  — услуги, входящие в заявку
```

## 🚀 Быстрый старт

### Требования

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) (рабочая нагрузка *ASP.NET и веб*)

### 1. Запуск базы данных

```bash
cd docker
docker-compose up -d
```

PostgreSQL будет доступен на `localhost:5432`.  
База данных автоматически создаётся с тестовыми данными из `docker/init.sql`.

### 2. Запуск бэкенда

Открой `TechCareAPI.sln` в Visual Studio и нажми **F5**, или через CLI:

```bash
cd TechCareAPI
dotnet run
```

Swagger UI: `http://localhost:7238/swagger`

### 3. Запуск фронтенда

```bash
cd TechCare-UI
npm install
npm run dev
```

Приложение: `http://localhost:5173`

## ⚙️ Конфигурация

Строка подключения к БД находится в `TechCareAPI/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=techcare;Username=techcare_user;Password=password123"
  }
}
```

Базовый URL API в `src/api/api.ts`:

```typescript
const BASE_URL = "http://localhost:7238/api";
```

## 📁 Структура проекта

```
TechCare/
├── docker/
│   ├── docker-compose.yml
│   └── init.sql                  # схема БД + тестовые данные
├── TechCareAPI/
│   ├── Controllers/              # 6 контроллеров (CRUD + аналитика)
│   ├── Models/                   # EF-сущности
│   ├── DTOs/                     # объекты передачи данных
│   ├── Data/
│   │   └── AppDbContext.cs
│   └── appsettings.json
└── TechCare-UI/
    └── src/
        ├── api/                  # axios-функции
        ├── components/           # Layout, Modal
        ├── pages/                # 7 страниц
        ├── types/                # TypeScript-интерфейсы
        └── utils/                # экспорт Excel / DOCX
```

## 📄 API эндпоинты

| Ресурс | Методы |
|--------|--------|
| `/api/clients` | GET, POST, PUT, DELETE |
| `/api/employees` | GET, POST, PUT, DELETE |
| `/api/devices` | GET, POST, PUT, DELETE |
| `/api/services` | GET, POST, PUT, DELETE |
| `/api/orders` | GET, POST, PUT, DELETE |
| `/api/analytics/summary` | GET |
| `/api/analytics/orders-by-month` | GET |
| `/api/analytics/top-services` | GET |
| `/api/analytics/employee-load` | GET |
| `/api/analytics/device-types` | GET |
| `/api/analytics/report` | GET |

## 🖼️ Страницы приложения

- **Dashboard** — сводная статистика и последние заявки
- **Аналитика** — графики (Recharts), KPI, экспорт в Excel и DOCX
- **Заявки** — полный CRUD, фильтрация по статусам
- **Клиенты** — управление базой клиентов
- **Устройства** — учёт техники с привязкой к клиенту
- **Сотрудники** — список мастеров и менеджеров
- **Услуги** — прайс-лист с описаниями

## 📦 Зависимости фронтенда

```bash
npm install recharts axios react-router-dom xlsx file-saver docx lucide-react
```

---

*Проект разработан в учебных целях.*