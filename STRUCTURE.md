# 📁 Структура проекта GSTelegramDiscord

```
📁 GSTelegramDiscord/
├── 📁 src/                          # 💻 Исходный код
│   ├── 📄 index.js                  # 🎯 Главный файл приложения
│   ├── 📄 index_safe.js             # 🛡️ Безопасная версия с демо-режимом
│   ├── 📄 googleSheets.js           # 📊 API для работы с Google Sheets
│   ├── 📄 telegramBot.js            # 📱 Telegram Bot функционал
│   ├── 📄 discordWebhook.js         # 💬 Discord Webhook интеграция
│   └── 📄 logger.js                 # 📝 Система логирования
│
├── 📁 tests/                        # 🧪 Тестирование
│   ├── 📄 test_virtualBot.js        # 🤖 Тесты Telegram бота
│   ├── 📄 test_googleSheets.js      # 📊 Тесты Google Sheets
│   └── 📄 test_discordWebhook.js    # 💬 Тесты Discord
│
├── 📁 scripts/                      # ⚡ Скрипты автоматизации
│   ├── 📄 install.sh                # 📦 Установка зависимостей
│   ├── 📄 start.sh                  # 🚀 Запуск приложения
│   ├── 📄 start_safe.sh             # 🛡️ Безопасный запуск
│   └── 📄 run_tests.sh              # 🧪 Запуск всех тестов
│
├── 📁 docs/                         # 📚 Документация
│   ├── 📄 SETUP.md                  # 🛠️ Руководство по установке
│   ├── 📄 API.md                    # 📚 Документация API
│   ├── 📄 TESTING.md                # 🧪 Руководство по тестированию
│   └── 📄 TEST_REPORT.md            # 📋 Отчет о тестировании
│
├── 📁 conf/                         # ⚙️ Конфигурационные файлы
│   ├── 📄 chat_ids.json             # 👥 Chat ID пользователей Telegram
│   └── 📄 discordbot.json           # 🔑 Ключи Google API
│
├── 📄 .env                          # 🔐 Переменные окружения
├── 📄 .env.example                  # 📋 Пример конфигурации
├── 📄 package.json                  # 📦 Зависимости и метаданные
├── 📄 .gitignore                    # 🚫 Игнорируемые Git файлы
├── 📄 LICENSE                       # ⚖️ Лицензия MIT
├── 📄 QUICKSTART.md                 # ⚡ Быстрый старт
└── 📄 README.md                     # 📖 Основная документация
```

## 🎯 Назначение модулей

### 🏗️ Исходный код (src/)
- **index.js** — основная точка входа, координирует работу всех модулей
- **index_safe.js** — безопасная версия для демонстрации без API ключей
- **googleSheets.js** — получение данных и заголовков из Google таблиц
- **telegramBot.js** — создание бота, обработка команд, управление пользователями
- **discordWebhook.js** — отправка красивых embed-сообщений в Discord
- **logger.js** — централизованная система логирования

### 🧪 Тестирование (tests/)
- **test_virtualBot.js** — виртуальное тестирование Telegram бота
- **test_googleSheets.js** — тестирование API Google Sheets
- **test_discordWebhook.js** — тестирование Discord webhook

### ⚡ Автоматизация (scripts/)
- **install.sh** — автоматическая установка всех зависимостей
- **start_safe.sh** — безопасный запуск с проверкой конфигурации
- **start.sh** — обычный запуск для продакшена
- **run_tests.sh** — запуск всех тестов одной командой

### 📚 Документация (docs/)
- **SETUP.md** — подробное руководство по настройке
- **API.md** — описание всех функций и методов
- **TESTING.md** — инструкции по тестированию
- **TEST_REPORT.md** — результаты последнего тестирования

---

<div align="center">

**Архитектура спроектирована для максимальной модульности и простоты поддержки**

</div>
