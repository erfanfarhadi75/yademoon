# یادمون

اپلیکیشن ثبت و یادآوری تولد عزیزان — رابط کاملاً فارسی و راست‌چین.

نام نمایشی محصول از طریق تنظیمات قابل پیکربندی است (پیش‌فرض: **یادمون**).

## پشته

| بخش | فناوری |
|-----|--------|
| Frontend | Angular 22 (standalone، Signals، Reactive Forms) |
| Backend | ASP.NET Core 10 Web API + Identity (کوکی) |
| DB | PostgreSQL 16 + EF Core |
| تقویم | `jalaali-js` (فرانت) · `PersianCalendar` (بک‌اند) |

## پیش‌نیاز

- Node.js 22+
- .NET SDK 10+
- Docker (برای Postgres) یا PostgreSQL محلی

## اجرا

```bash
# 1) دیتابیس
cp .env.example .env
docker compose up -d

# 2) API  → http://localhost:5080
cd backend
dotnet ef database update --project Yademoon.Infrastructure --startup-project Yademoon.Api
dotnet run --project Yademoon.Api --launch-profile http

# 3) Angular → http://localhost:4200
cd ../frontend
npm install
npm start
```

در حالت توسعه، فرانت‌اند `apiBaseUrl` را خالی می‌گذارد و از پروکسی Angular (`proxy.conf.json`) به پورت ۵۰۸۰ استفاده می‌کند تا کوکی احراز هویت same-origin باشد.

### پیکربندی نام محصول

- Backend: `Product:DisplayName` در `appsettings.json` یا متغیر محیطی `Product__DisplayName`
- Frontend: `productName` در `src/environments/environment.ts`

### قرارداد تاریخ

- ذخیره: تاریخ میلادی `DATE` / `DateOnly` به صورت `YYYY-MM-DD`
- نمایش/ورود: شمسی در UI
- تولد بعدی بر اساس ماه/روز شمسی؛ در سال غیرکبیسه، **۳۰ اسفند → ۲۹ اسفند**

## تست

```bash
cd backend && dotnet test
cd ../frontend && npm test -- --run
```

## ساختار

```
backend/   Yademoon.Api | Application | Domain | Infrastructure | Tests
frontend/  core | shared | features/{auth,dashboard,people,settings}
```
