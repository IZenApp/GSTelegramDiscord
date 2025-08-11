<div align="center">

# ⚡ Быстрый запуск GSTelegramDiscord

*Запустите интеграцию Google Sheets ↔ Telegram ↔ Discord за 2 минуты*

</div>

## 🚀 Шаг 1: Установка

```bash
./scripts/install.sh
```

## 🎭 Шаг 2: Демо-режим

```bash
./scripts/start_safe.sh
```

> Этот режим покажет как работает бот **без настройки API**

## ⚙️ Шаг 3: Настройка (опционально)

1. Скопируйте пример конфига:
   ```bash
   cp .env.example .env
   ```

2. Заполните `.env` своими ключами:
   ```env
   SHEET_ID=ваш_ID_таблицы
   TELEGRAM_TOKEN=ваш_токен_бота  
   DISCORD_WEBHOOK=ваш_webhook_URL
   ```

3. Добавьте Google API ключи в `conf/discordbot.json`

## 🎯 Шаг 4: Продакшен

```bash
./scripts/start.sh
```

---

## 🧪 Бонус: Тестирование

```bash
./scripts/run_tests.sh    # Все тесты
npm run test:virtual      # Только Telegram
npm run test:sheets       # Только Google Sheets  
npm run test:discord      # Только Discord
```

<div align="center">

### 🎉 Готово! Бот запущен и работает

**Больше информации:** [📖 docs/SETUP.md](docs/SETUP.md) | [📚 docs/API.md](docs/API.md)

</div>
