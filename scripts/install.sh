#!/bin/bash
# Скрипт установки зависимостей

echo "📦 Установка зависимостей для GSTelegramDiscord..."

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен!"
    echo "Установите Node.js с https://nodejs.org"
    exit 1
fi

# Установка зависимостей
echo "⬇️ Устанавливаю npm пакеты..."
npm install

# Проверка установки
if [ $? -eq 0 ]; then
    echo "✅ Зависимости успешно установлены!"
    echo "📝 Не забудьте настроить .env файл"
else
    echo "❌ Ошибка при установке зависимостей"
    exit 1
fi
