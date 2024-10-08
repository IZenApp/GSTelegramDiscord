// Импортируем необходимые библиотеки
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Настройки для Google Sheets API
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const credentialsPath = path.join(process.cwd(), 'conf/discordbot.json');
const auth = new GoogleAuth({
  keyFile: credentialsPath,
  scopes: SCOPES,
});
const sheets = google.sheets({ version: 'v4', auth });

// Получаем лист Google Sheets
const sheetId = '1uzFT3J3QbluLhM2SsB6TqBghPV2J4ftkcOSNFpzUc7c'; // Замените на свой ID Google Sheets

// Настройки Telegram
const botToken = '7678987754:AAE3v8GmtwD8KPzLiPO1itoqnnoNBmFXDCc';
const bot = new TelegramBot(botToken, { polling: true });

// URL вебхука Discord
const discordWebhookUrl = 'https://discord.com/api/webhooks/1292903156556103763/QEiWjpa8pb-S9Sy_HoqpPTubsf3ys5iiELqT0b4QO2LfwQFQ7msA3-CoE9Ht1IjwZ1w-';

// Хранение chat ID пользователей
let userChatIds = new Set();

// Загрузка chat ID из файла
function loadChatIds() {
  try {
    const data = fs.readFileSync('conf/chat_ids.json', 'utf-8');
    userChatIds = new Set(JSON.parse(data));
    console.log('Загружены chat IDs:', userChatIds);
  } catch (error) {
    console.log('Не удалось загрузить chat IDs:', error);
  }
}

// Сохранение chat ID в файл
function saveChatIds() {
  fs.writeFileSync('conf/chat_ids.json', JSON.stringify([...userChatIds]));
  console.log('Chat IDs сохранены:', userChatIds);
}

// Команда /start для регистрации пользователей
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userChatIds.add(chatId);
  saveChatIds();
  bot.sendMessage(chatId, 'Вы успешно зарегистрированы для получения обновлений!');
  console.log(`Пользователь ${chatId} зарегистрирован.`);
});

// Команда для тестирования отправки сообщения
bot.onText(/\/test/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Это тестовое сообщение!')
    .then(() => console.log(`Тестовое сообщение отправлено пользователю ${chatId}`))
    .catch((error) => console.log('Ошибка при отправке тестового сообщения:', error));
});

// Проверка обновлений в Google Sheets
let previousData = [];

async function checkForUpdates() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!B2:Z1000', // Укажите диапазон ваших данных
    });
    const currentData = response.data.values || [];

    if (JSON.stringify(currentData) !== JSON.stringify(previousData)) {
      console.log('Обнаружены обновления в Google Sheets!');
      previousData = currentData;
      return currentData[currentData.length - 1]; // Возвращаем только последнюю строку
    } else {
      // console.log('Нет новых данных.');
      return null;
    }
  } catch (error) {
    console.error('Ошибка при получении данных из Google Sheets:', error);
    return null;
  }
}

// Обработка подтверждения
bot.onText(/\/confirm (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    
    try {
      const formData = JSON.parse(match[1]); // Получаем данные формы как массив
  
      const message = `*Данные формы подтверждены:*\n\n` + 
                      formData.map((item, index) => `• Поле ${index + 1}: ${item}`).join('\n');
  
      // Отправляем данные в Discord
      await sendMessageToDiscord(formData);
  
      // Отправляем подтверждение в Telegram
      bot.sendMessage(chatId, message, { parse_mode: 'MarkdownV2' });
    } catch (error) {
      console.error('Ошибка при обработке команды /confirm:', error);
      bot.sendMessage(chatId, 'Произошла ошибка при подтверждении данных. Пожалуйста, попробуйте еще раз.');
    }
  });

// Обработка отклонения
bot.onText(/\/decline/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Вы отклонили данные.');
});

// Отправка сообщения в Discord
async function sendMessageToDiscord(formData) {
  const headers = await getSheetHeaders(); // Получаем заголовки (вопросы)

  const fieldsForDiscord = formData.map((item, index) => {
    const header = headers[index] || `Поле ${index + 1}`; // Используем заголовок или номер поля, если заголовок не найден
    return `**${header}:** ${item}`;
  }).join('\n');

  try {
    const payload = {
      embeds: [{
        title: 'Новая форма:',
        description: fieldsForDiscord, // Добавляем заголовки и ответы для Discord
        color: 0xFFA500, // Цвет рамки (можно изменить)
        footer: {
          text: 'Одобрено: ' + new Date().toLocaleString(),
        },
        // timestamp: new Date(),
      }],
      content: '@everyone', // или другой текст, если нужно
    };
    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.status === 204) {
      console.log('Сообщение успешно отправлено в Discord.');
    } else {
      console.log(`Ошибка при отправке в Discord: ${response.status}`);
    }
  } catch (error) {
    console.error('Ошибка при отправке в Discord:', error);
  }
}

// Отправка обновлений в Telegram
// Хранилище данных форм
const formStore = [];

// Сохранение данных формы и возвращение индекса
function storeFormData(data) {
  formStore.push(data);
  return formStore.length - 1;
}

async function getSheetHeaders() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!B1:Z1', // Первая строка с заголовками
    });
    return response.data.values[0]; // Возвращаем первую строку как массив заголовков
  } catch (error) {
    console.error('Ошибка при получении заголовков из Google Sheets:', error);
    return [];
  }
}

// Отправка обновлений в Telegram с короткими данными для кнопок
async function handleTelegramUpdates(data) {
  const headers = await getSheetHeaders(); // Получаем заголовки (вопросы)
  const formDataIndex = storeFormData(data); // Сохраняем данные формы и получаем индекс

  const message = `Новая форма поступила! Пожалуйста, подтвердите или отклоните.\n\n`;

  const formFields = data.map((item, index) => {
    const header = headers[index] || `Поле ${index + 1}`; // Используем заголовок или номер поля, если заголовок не найден
    return `*${header}:* ${item}`;
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
      .then(() => console.log(`Сообщение отправлено пользователю ${chatId}`))
      .catch((error) => console.log(`Ошибка при отправке сообщения пользователю ${chatId}:`, error));
  }
}

// Обработка нажатий на кнопки
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const action = callbackQuery.data;

  if (action.startsWith('confirm_')) {
    const formDataIndex = parseInt(action.replace('confirm_', ''), 10);
    const formData = formStore[formDataIndex];
    await sendMessageToDiscord(formData);
    bot.sendMessage(chatId, 'Данные успешно отправлены в Discord.');
  } else if (action === 'decline') {
    bot.sendMessage(chatId, 'Вы отклонили данные.');
  }

  bot.deleteMessage(chatId, callbackQuery.message.message_id).catch((error) => {
    console.log('Ошибка при удалении сообщения:', error);
  });
});

// Основной цикл проверки Google Sheets
async function main() {
  loadChatIds();
  previousData = await checkForUpdates();

  setInterval(async () => {
    const updates = await checkForUpdates();
    if (updates) {
      await handleTelegramUpdates(updates);
    }
  }, 10000); // Проверка каждые 10 секунд
}

main();