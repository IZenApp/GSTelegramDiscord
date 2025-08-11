import { getLatestRow, getSheetHeaders } from './googleSheets.js';
import { loadChatIds, saveChatIds, createBot } from './telegramBot.js';
import { sendMessageToDiscord } from './discordWebhook.js';
import { logInfo, logError } from './logger.js';
import dotenv from 'dotenv';

dotenv.config();

// Конфиги из переменных окружения
const sheetId = process.env.SHEET_ID;
const botToken = process.env.TELEGRAM_TOKEN;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK;
const checkInterval = parseInt(process.env.CHECK_INTERVAL) || 10000;

// Проверка конфигурации
if (!sheetId || !botToken || !discordWebhookUrl) {
  logError('Отсутствуют обязательные переменные окружения. Проверьте .env файл.');
  process.exit(1);
}

// Telegram
const bot = createBot(botToken);
let userChatIds = loadChatIds();
const formStore = [];
let previousData = [];

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

bot.onText(/\/confirm (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  try {
    const formData = JSON.parse(match[1]);
    const message = `*Данные формы подтверждены:*\n\n` + formData.map((item, index) => `• Поле ${index + 1}: ${item}`).join('\n');
    await sendMessageToDiscord(formData, sheetId, discordWebhookUrl);
    bot.sendMessage(chatId, message, { parse_mode: 'MarkdownV2' });
    logInfo(`Данные формы подтверждены пользователем ${chatId}`);
  } catch (error) {
    bot.sendMessage(chatId, 'Ошибка при подтверждении данных.');
    logError(`Ошибка при подтверждении данных: ${error}`);
  }
});

bot.onText(/\/decline/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Вы отклонили данные.');
  logInfo(`Пользователь ${msg.chat.id} отклонил данные.`);
});

function storeFormData(data) {
  formStore.push(data);
  return formStore.length - 1;
}

async function handleTelegramUpdates(data) {
  const headers = await getSheetHeaders(sheetId);
  const formDataIndex = storeFormData(data);
  const message = `Новая форма поступила!\n\n`;
  const formFields = data.map((item, index) => {
    const header = headers[index] || `Поле ${index + 1}`;
    return `**${header}:**\n${item}`;
  }).join('\n');
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Подтвердить', callback_data: `confirm_${formDataIndex}` },
          { text: 'Отклонить', callback_data: 'decline' },
        ],
      ],
    },
  };
  for (const chatId of userChatIds) {
    bot.sendMessage(chatId, `${message}${formFields}`, { parse_mode: 'Markdown', reply_markup: options.reply_markup })
      .then(() => logInfo(`Сообщение отправлено пользователю ${chatId}`))
      .catch((error) => logError(`Ошибка при отправке сообщения пользователю ${chatId}: ${error}`));
  }
}

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
  bot.deleteMessage(chatId, callbackQuery.message.message_id).catch((error) => logError(`Ошибка при удалении сообщения: ${error}`));
});

async function main() {
  logInfo('Запуск бота...');
  previousData = await getLatestRow(sheetId);
  
  setInterval(async () => {
    const updates = await getLatestRow(sheetId);
    if (updates && JSON.stringify(updates) !== JSON.stringify(previousData)) {
      previousData = updates;
      await handleTelegramUpdates(updates);
      logInfo('Обнаружены новые данные в Google Sheets и отправлены пользователям.');
    }
  }, checkInterval);
  
  logInfo(`Бот запущен. Проверка Google Sheets каждые ${checkInterval}мс.`);
}

main();
