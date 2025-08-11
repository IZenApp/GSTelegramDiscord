// Виртуальный тест для Discord Webhook модуля
// Тестирует форматирование сообщений без реальной отправки

const mockFormData = ['Иван Иванов', 'ivan@example.com', 'Тестовое сообщение', '2025-01-01'];
const mockHeaders = ['Имя', 'Email', 'Сообщение', 'Дата'];

// Виртуальная функция отправки в Discord
function virtualSendMessageToDiscord(formData, headers) {
  const fieldsForDiscord = formData.map((item, index) => {
    const header = headers[index] || `Поле ${index + 1}`;
    return `**${header}:**\n${item}`;
  }).join('\n');

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
  
  return payload;
}

// Тестирование
console.log('=== Тест Discord Webhook модуля ===');
const discordPayload = virtualSendMessageToDiscord(mockFormData, mockHeaders);
console.log('Discord payload:');
console.log(JSON.stringify(discordPayload, null, 2));

// Тест проверки размера сообщения
const messageSize = JSON.stringify(discordPayload).length;
console.log(`Размер сообщения: ${messageSize} символов`);
console.log(messageSize < 2000 ? '✅ Размер в пределах лимита Discord' : '❌ Сообщение слишком длинное');
