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

Вход по логину и паролю. По умолчанию локально: логин `admin`, пароль `fastled`
(или значения из `.env.local`: `ADMIN_LOGIN`, `ADMIN_PASSWORD`).

Логин и пароль можно сменить в админке → **Контакты** → блок «Вход в админку».
После смены данные хранятся в `data/admin.json` (локально) или в Vercel Blob.

На Vercel добавьте:
- `ADMIN_LOGIN` / `ADMIN_PASSWORD` (стартовые, пока не сменили в админке)
- `ADMIN_SECRET` (рекомендуется — секрет сессии, не меняется при смене пароля)
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob), иначе изменения после деплоя не сохранятся.

