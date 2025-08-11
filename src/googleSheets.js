import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import path from 'path';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const credentialsPath = path.join(process.cwd(), 'conf/discordbot.json');
const auth = new GoogleAuth({
  keyFile: credentialsPath,
  scopes: SCOPES,
});
const sheets = google.sheets({ version: 'v4', auth });

export async function getSheetHeaders(sheetId) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!C1:F1',
    });
    return response.data.values[0];
  } catch (error) {
    console.error('Ошибка при получении заголовков из Google Sheets:', error);
    return [];
  }
}

export async function getLatestRow(sheetId) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Sheet1!C2:F',
    });
    const currentData = response.data.values || [];
    return currentData[currentData.length - 1] || null;
  } catch (error) {
    console.error('Ошибка при получении данных из Google Sheets:', error);
    return null;
  }
}
