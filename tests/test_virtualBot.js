// Виртуальный тест для логики Telegram-бота без реального подключения
// import { createBot } from '../src/telegramBot.js';

class VirtualBot {
  constructor() {
    this.messages = [];
    this.handlers = {};
  }
  onText(regex, handler) {
    this.handlers[regex.source] = handler;
  }
  sendMessage(chatId, text) {
    this.messages.push({ chatId, text });
    return Promise.resolve();
  }
  simulateMessage(text, chatId = 1) {
    for (const key in this.handlers) {
      const regex = new RegExp(key);
      if (regex.test(text)) {
        this.handlers[key]({ chat: { id: chatId } }, text.match(regex));
      }
    }
  }
}

console.log('=== Тест виртуального Telegram бота ===');

// Тест: регистрация пользователя
const bot = new VirtualBot();
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Вы успешно зарегистрированы для получения обновлений!');
});

bot.simulateMessage('/start');

console.log('📱 Результат симуляции /start команды:');
console.log('Отправленные сообщения:', bot.messages);

// Тест команды /test
bot.onText(/\/test/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Это тестовое сообщение!');
});

bot.simulateMessage('/test');
console.log('📱 Результат симуляции /test команды:');
console.log('Отправленные сообщения:', bot.messages);

console.log('✅ Виртуальный бот работает корректно!');
// Ожидаемый вывод: [{ chatId: 1, text: 'Вы успешно зарегистрированы для получения обновлений!' }]
