# GSTelegramDiscord - тесты и разработка

## Структура тестов

Проект содержит виртуальные тесты, которые не требуют реального подключения к Telegram API:

### test_virtualBot.js
Тестирует логику обработки команд Telegram-бота без реального подключения к сети.

```bash
node src/test_virtualBot.js
```

### test_googleSheets.js 
Тестирует обработку данных из Google Sheets с мок-данными.

```bash
node src/test_googleSheets.js
```

### test_discordWebhook.js
Тестирует форматирование сообщений для Discord без реальной отправки.

```bash
node src/test_discordWebhook.js
```

## Запуск всех тестов

```bash
npm test
```

## Разработка

Для разработки с автоматической перезагрузкой:

```bash
npm run dev
```
