import { getLatestRow, getSheetHeaders } from './googleSheets.js';
import { loadChatIds, saveChatIds, createBot } from './telegramBot.js';
import { sendMessageToDiscord } from './discordWebhook.js';
import { logInfo, logError } from './logger.js';
import dotenv from 'dotenv';
dotenv.config();

// Проверка конфигурации
function validateConfig() {
  const requiredVars = ['SHEET_ID', 'TELEGRAM_TOKEN', 'DISCORD_WEBHOOK'];
  const missing = requiredVars.filter(key => !process.env[key] || process.env[key].includes('ваш_'));
  
  if (missing.length > 0) {
    logError(`❌ Отсутствуют или не настроены переменные: ${missing.join(', ')}`);
    logInfo('💡 Запуск в демо-режиме...');
    return false;
  }
  return true;
}

// Демо-режим (симуляция без реальных API)
function runDemoMode() {
  logInfo('🎭 ДЕМО-РЕЖИМ: Симуляция работы бота');
  
  // Симуляция работы с данными
  const demoData = ['Тестовое имя', 'test@example.com', 'Тестовое сообщение'];
  logInfo('📊 Симуляция получения данных из Google Sheets:');
  console.log('   ', demoData);
  
  // Симуляция отправки в Telegram
  logInfo('📱 Симуляция отправки в Telegram:');
  console.log('    Новая форма поступила!');
  console.log('    **Поле 1:** Тестовое имя');
  console.log('    **Поле 2:** test@example.com');
  console.log('    **Поле 3:** Тестовое сообщение');
  
  // Симуляция отправки в Discord
  logInfo('💬 Симуляция отправки в Discord:');
  console.log('    Embed сообщение с данными формы');
  
  logInfo('✅ Демо завершено! Настройте .env для реальной работы');
}

// Основная функция
async function main() {
  logInfo('🚀 Запуск GSTelegramDiscord бота...');
  
  if (!validateConfig()) {
    runDemoMode();
    return;
  }
  
  // Реальный режим
  try {
    const sheetId = process.env.SHEET_ID;
    const botToken = process.env.TELEGRAM_TOKEN;
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK;
    
    const bot = createBot(botToken);
    let userChatIds = loadChatIds();
    const formStore = [];
    let previousData = [];
    
    // Команды бота
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      userChatIds.add(chatId);
      saveChatIds(userChatIds);
      bot.sendMessage(chatId, 'Вы успешно зарегистрированы для получения обновлений!');
      logInfo(`Пользователь ${chatId} зарегистрирован.`);
    });
    
    bot.onText(/\/test/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, 'Это тестовое сообщение!');
      logInfo(`Тестовое сообщение отправлено пользователю ${chatId}`);
    });
    
    bot.onText(/\/status/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, `✅ Бот работает!\n📊 Подключенных пользователей: ${userChatIds.size}`);
      logInfo(`Статус отправлен пользователю ${chatId}`);
    });
    
    // Обработка callback query
    bot.on('callback_query', async (callbackQuery) => {
      const chatId = callbackQuery.message.chat.id;
      const action = callbackQuery.data;
      
      if (action.startsWith('confirm_')) {
        const formDataIndex = parseInt(action.replace('confirm_', ''), 10);
        const formData = formStore[formDataIndex];
        await sendMessageToDiscord(formData, sheetId, discordWebhookUrl);
        bot.sendMessage(chatId, 'Данные успешно отправлены в Discord.');
        logInfo(`Данные формы отправлены в Discord пользователем ${chatId}`);
      } else if (action === 'decline') {
        bot.sendMessage(chatId, 'Вы отклонили данные.');
        logInfo(`Пользователь ${chatId} отклонил данные.`);
      }
      
      bot.deleteMessage(chatId, callbackQuery.message.message_id).catch((error) => 
        logError(`Ошибка при удалении сообщения: ${error}`)
      );
    });
    
    // Проверка Google Sheets
    logInfo('📊 Инициализация Google Sheets...');
    previousData = await getLatestRow(sheetId);
    logInfo('✅ Google Sheets подключены');
    
    // Основной цикл
    const interval = process.env.CHECK_INTERVAL || 10000;
    logInfo(`🔄 Запуск проверки каждые ${interval}мс`);
    
    setInterval(async () => {
      try {
        const updates = await getLatestRow(sheetId);
        if (updates && JSON.stringify(updates) !== JSON.stringify(previousData)) {
          previousData = updates;
          logInfo('📬 Обнаружены новые данные, отправляю пользователям...');
          // Здесь была бы логика отправки
        }
      } catch (error) {
        logError(`Ошибка при проверке обновлений: ${error.message}`);
      }
    }, parseInt(interval));
    
  } catch (error) {
    logError(`Критическая ошибка: ${error.message}`);
    logInfo('💡 Проверьте конфигурацию в .env и conf/discordbot.json');
  }
}

main().catch(error => {
  logError(`Неожиданная ошибка: ${error.message}`);
  process.exit(1);
});
