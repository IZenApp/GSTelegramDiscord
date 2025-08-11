# API документация

## Google Sheets API

### getSheetHeaders(sheetId)
Получает заголовки из первой строки таблицы.

**Параметры:**
- `sheetId` - ID Google Sheets таблицы

**Возвращает:**
- Array - массив заголовков

### getLatestRow(sheetId)
Получает последнюю строку данных.

**Параметры:**
- `sheetId` - ID Google Sheets таблицы

**Возвращает:**
- Array|null - массив данных или null

## Telegram Bot API

### createBot(token)
Создает экземпляр Telegram бота.

**Параметры:**
- `token` - токен бота

**Возвращает:**
- TelegramBot - экземпляр бота

### loadChatIds()
Загружает chat ID из файла.

**Возвращает:**
- Set - множество chat ID

### saveChatIds(chatIds)
Сохраняет chat ID в файл.

**Параметры:**
- `chatIds` - множество chat ID

## Discord Webhook API

### sendMessageToDiscord(formData, sheetId, webhookUrl)
Отправляет сообщение в Discord через webhook.

**Параметры:**
- `formData` - данные формы (массив)
- `sheetId` - ID Google Sheets таблицы
- `webhookUrl` - URL Discord webhook

**Возвращает:**
- boolean - успешность отправки
