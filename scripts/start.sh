#!/bin/bash
# Скрипт запуска основного приложения

echo "🚀 Запуск GSTelegramDiscord бота..."

# Проверка .env файла
if [ ! -f ".env" ]; then
    echo "❌ Файл .env не найден!"
    echo "Создайте файл .env и заполните нужные переменные:"
    echo "SHEET_ID=ваш_ID_таблицы"
    echo "TELEGRAM_TOKEN=ваш_токен_бота"
    echo "DISCORD_WEBHOOK=ваш_webhook_URL"
    exit 1
fi

# Проверка Google API ключа
if [ ! -f "conf/discordbot.json" ]; then
    echo "❌ Файл conf/discordbot.json не найден!"
    echo "Поместите JSON файл с ключами Google API в папку conf/"
    exit 1
fi

# Запуск приложения
echo "✅ Конфигурация найдена, запускаю бота..."
node src/index.js
