# 🚀 Быстрое развертывание Википедии WFRP

## Вариант 1: Готовые файлы (самый быстрый)

```bash
# Скопировать папку dist/ на ваш веб-сервер
cp -r wfrp-wiki/dist/* /path/to/your/webserver/

# Или загрузить содержимое dist/ через FTP/панель хостинга
```

## Вариант 2: Локальный запуск

```bash
cd wfrp-wiki
pnpm install  # или npm install
pnpm dev      # или npm run dev
# Открыть http://localhost:5173
```

## Вариант 3: Пересборка проекта

```bash
cd wfrp-wiki
pnpm install  # или npm install
pnpm build    # или npm run build
# Результат в папке dist/
```

## 🔐 Вход в систему

- **URL**: Ваш сайт
- **Логин**: admin
- **Пароль**: admin123

## 📁 Что загружать на хостинг

Содержимое папки `wfrp-wiki/dist/`:
- index.html
- wfrp_wiki_data.json  
- assets/ (CSS и JS файлы)

## ⚡ Хостинги где работает

- ✅ Netlify (drag & drop папки dist/)
- ✅ Vercel (подключить GitHub)
- ✅ GitHub Pages 
- ✅ Любой обычный хостинг
- ✅ Локальный веб-сервер

**Автор**: MiniMax Agent | **Дата**: 19.06.2025
