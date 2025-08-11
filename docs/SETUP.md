# Руководство по установке и настройке

## Быстрый старт

1. **Установка зависимостей:**
   ```bash
   ./scripts/install.sh
   ```

2. **Настройка конфигурации:**
   - Создайте файл `.env` и заполните:
     ```env
     SHEET_ID=ваш_ID_таблицы
     TELEGRAM_TOKEN=ваш_токен_бота
     DISCORD_WEBHOOK=ваш_webhook_URL
     ```
   - Поместите JSON файл с Google API ключами в `conf/discordbot.json`

3. **Запуск приложения:**
   ```bash
   ./scripts/start.sh
   ```

## Тестирование

Запуск всех тестов:
```bash
./scripts/run_tests.sh
```

Подробности в [docs/TESTING.md](TESTING.md)

## Структура проекта

```
├── src/                    # Исходный код
│   ├── index.js           # Главный файл
│   ├── googleSheets.js    # Работа с Google Sheets
│   ├── telegramBot.js     # Telegram бот
│   ├── discordWebhook.js  # Discord интеграция
│   └── logger.js          # Логирование
├── tests/                 # Тесты
├── scripts/               # Скрипты запуска
├── conf/                  # Конфигурация
├── docs/                  # Документация
└── .env                   # Переменные окружения
```
