import { Telegraf, Markup } from 'telegraf';
import { google } from 'googleapis';
import fetch from 'node-fetch';

const bot = new Telegraf('7678987754:AAE3v8GmtwD8KPzLiPO1itoqnnoNBmFXDCc'); // Замените на свой токен бота

const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
  keyFile: 'discordbot-437914-409ab6e0cef6.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const spreadsheetId = '1uzFT3J3QbluLhM2SsB6TqBghPV2J4ftkcOSNFpzUc7c';
const range = 'Sheet1!A:B';

async function getSheetData() {
  const authClient = await auth.getClient();
  const response = await sheets.spreadsheets.values.get({
    auth: authClient,
    spreadsheetId: spreadsheetId,
    range: range,
  });
  return response.data.values;
}

bot.start((ctx) => {
  ctx.reply('Привет! Я буду присылать формы из Google Sheets для принятия или отклонения.');
});

bot.command('getform', async (ctx) => {
  const data = await getSheetData();
  console.log('Полученные данные из Google Sheets:', data); // Логирование данных

  if (!data || data.length === 0) {
    ctx.reply('Нет данных в Google Sheets.');
    return;
  }

  data.forEach((row) => {
    const message = `Форма: ${row.join(', ')}`;
    ctx.telegram.sendMessage(ctx.message.chat.id, message, Markup.inlineKeyboard([
      Markup.button.callback('Принять', `accept_${row.join('_')}`),
      Markup.button.callback('Отклонить', `decline_${row.join('_')}`)
    ]));
  });
});

bot.action(/accept_(.+)/, async (ctx) => {
  const form = ctx.match[1].split('_').join(', ');

  const webhookUrl = 'https://discord.com/api/webhooks/1292903156556103763/QEiWjpa8pb-S9Sy_HoqpPTubsf3ys5iiELqT0b4QO2LfwQFQ7msA3-CoE9Ht1IjwZ1w-';
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `Принята форма: ${form}` }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
    }

    ctx.reply('Форма принята и отправлена в Discord!');
  } catch (error) {
    console.error('Ошибка отправки в Discord:', error);
    ctx.reply('Произошла ошибка при отправке формы в Discord.');
  }
});

bot.action(/decline_(.+)/, (ctx) => {
  ctx.reply('Форма отклонена.');
});

// Запуск бота
bot.launch().then(() => {
  console.log('Бот запущен и готов к работе.');
}).catch(err => {
  console.error('Ошибка запуска бота:', err);
});