# Fast LED

Сайт компании Fast LED — продажа и монтаж LED-экранов в Душанбе.

Стек: Next.js, TypeScript, Tailwind CSS.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Админка

Адрес: [http://localhost:3000/admin](http://localhost:3000/admin)

Пароль задайте в `.env.local` (`ADMIN_PASSWORD`). Локально, если переменной нет, пароль `fastled`.

На Vercel добавьте:
- `ADMIN_PASSWORD`
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob), иначе изменения после деплоя не сохранятся.

