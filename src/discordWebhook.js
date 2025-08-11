import fetch from 'node-fetch';
import { getSheetHeaders } from './googleSheets.js';

export async function sendMessageToDiscord(formData, sheetId, discordWebhookUrl) {
  const headers = await getSheetHeaders(sheetId);
  const fieldsForDiscord = formData.map((item, index) => {
    const header = headers[index] || `Поле ${index + 1}`;
    return `**${header}:**\n${item}`;
  }).join('\n');

  try {
    const payload = {
      embeds: [{
        description: fieldsForDiscord,
        color: 0xFFA500,
        footer: {
          text: 'Одобрено: ' + new Date().toLocaleString(),
        },
      }],
      content: '@everyone',
    };
    const response = await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.status === 204;
  } catch (error) {
    console.error('Ошибка при отправке в Discord:', error);
    return false;
  }
}
