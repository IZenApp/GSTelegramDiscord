#!/bin/bash
# Безопасный запуск с проверкой конфигурации

echo "🚀 Безопасный запуск GSTelegramDiscord бота..."

# Проверка .env файла
if [ ! -f ".env" ]; then
    echo "❌ Файл .env не найден!"
    echo "Создайте файл .env из примера:"
    echo "cp .env.example .env"
    exit 1
fi

# Проверка содержимого .env
if grep -q "ваш_" .env; then
    echo "⚠️  В .env обнаружены незаполненные поля"
    echo "🎭 Запуск в демо-режиме..."
else
    echo "✅ Конфигурация проверена"
fi

# Запуск безопасной версии
echo "🔄 Запускаю безопасную версию..."
node src/index_safe.js
