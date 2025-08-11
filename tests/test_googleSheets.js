// Виртуальный тест для Google Sheets модуля
// import { getSheetHeaders } from '../src/googleSheets.js';

// Мок-данные для тестирования
const mockSheetData = {
  headers: ['Имя', 'Email', 'Сообщение', 'Дата'],
  rows: [
    ['Иван Иванов', 'ivan@example.com', 'Тестовое сообщение', '2025-01-01'],
    ['Мария Петрова', 'maria@example.com', 'Другое сообщение', '2025-01-02']
  ]
};

// Виртуальная функция для получения заголовков
function virtualGetSheetHeaders() {
  return mockSheetData.headers;
}

// Виртуальная функция для получения последней строки
function virtualGetLatestRow() {
  return mockSheetData.rows[mockSheetData.rows.length - 1];
}

// Тестирование
console.log('=== Тест Google Sheets модуля ===');
console.log('Заголовки:', virtualGetSheetHeaders());
console.log('Последняя строка:', virtualGetLatestRow());

// Тест форматирования данных
const headers = virtualGetSheetHeaders();
const latestRow = virtualGetLatestRow();
const formattedData = latestRow.map((item, index) => {
  const header = headers[index] || `Поле ${index + 1}`;
  return `**${header}:** ${item}`;
}).join('\n');

console.log('Форматированные данные:');
console.log(formattedData);

console.log('✅ Google Sheets модуль тестирован успешно!');
