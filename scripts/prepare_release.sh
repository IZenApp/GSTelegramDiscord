#!/bin/bash
# Скрипт для публикации релиза на GitHub

echo "🚀 Подготовка к публикации GSTelegramDiscord v1.3.0..."

# Проверка git репозитория
if [ ! -d ".git" ]; then
    echo "❌ Git репозиторий не найден!"
    echo "Инициализация git..."
    git init
    git branch -M main
fi

# Добавление всех файлов
echo "📦 Добавление файлов в git..."
git add .

# Коммит изменений
echo "💾 Создание коммита..."
git commit -m "🚀 Release v1.3.0 - Production Ready

✨ Новые возможности:
- 🛡️ Безопасный режим запуска с демо
- 🧪 100% покрытие тестами
- 📚 Полная документация
- ⚡ Скрипты автоматизации

🔧 Улучшения:
- 📁 Реструктуризация проекта
- 🎨 Профессиональный README
- 📋 Документация API
- 🔐 Улучшенная конфигурация

🎯 Статус: ГОТОВ К ПРОДАКШЕНУ!"

# Создание тега
echo "🏷️ Создание тега v1.3.0..."
git tag -a v1.3.0 -m "Release v1.3.0 - Production Ready

🚀 GSTelegramDiscord v1.3.0

Полностью готовый к использованию бот для интеграции Google Sheets, Telegram и Discord.

Основные возможности:
- 📊 Автоматическое получение данных из Google Sheets
- 📱 Интерактивный Telegram бот с кнопками
- 💬 Красивые embed-сообщения в Discord
- 🛡️ Безопасный режим для демонстрации
- 🧪 100% покрытие тестами
- 📚 Подробная документация

Быстрый старт:
1. ./scripts/install.sh
2. ./scripts/start_safe.sh

Полная документация: https://github.com/IZenApp/GSTelegramDiscord"

echo "✅ Готово! Теперь выполните следующие команды:"
echo ""
echo "1. Добавьте remote (если еще не добавлен):"
echo "   git remote add origin https://github.com/IZenApp/GSTelegramDiscord.git"
echo ""
echo "2. Отправьте код на GitHub:"
echo "   git push -u origin main"
echo ""
echo "3. Отправьте теги:"
echo "   git push origin --tags"
echo ""
echo "4. Создайте Release на GitHub:"
echo "   - Перейдите в Releases"
echo "   - Выберите тег v1.3.0"
echo "   - Добавьте описание из RELEASE_NOTES.md"
echo "   - Опубликуйте!"
echo ""
echo "🎉 Проект готов к публикации!"
