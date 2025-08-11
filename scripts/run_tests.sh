#!/bin/bash

echo "🚀 Запуск всех тестов GSTelegramDiscord..."
echo

echo "📋 Тест виртуального Telegram бота:"
node tests/test_virtualBot.js
echo

echo "📊 Тест Google Sheets модуля:"
node tests/test_googleSheets.js
echo

echo "💬 Тест Discord Webhook модуля:"
node tests/test_discordWebhook.js
echo

echo "✅ Все тесты завершены!"
