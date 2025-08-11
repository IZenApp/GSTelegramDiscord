import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import path from 'path';

const chatIdsFilePath = path.join(process.cwd(), 'conf/chat_ids.json');
let userChatIds = new Set();

export function loadChatIds() {
  try {
    if (!fs.existsSync(chatIdsFilePath)) {
      fs.writeFileSync(chatIdsFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(chatIdsFilePath, 'utf-8');
    userChatIds = data.trim().length === 0 ? new Set() : new Set(JSON.parse(data));
    return userChatIds;
  } catch (error) {
    console.log('Не удалось загрузить chat IDs:', error);
    return new Set();
  }
}

export function saveChatIds(chatIds) {
  fs.writeFileSync(chatIdsFilePath, JSON.stringify([...chatIds]));
}

export function createBot(botToken) {
  return new TelegramBot(botToken, { polling: true });
}
