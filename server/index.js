import express from 'express';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config({ path: '.env.local' });

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(express.json());

const getSheetsClient = async () => {
  const base64 = process.env.GOOGLE_CREDENTIALS_BASE64;
  if (!base64) {
    throw new Error('Missing GOOGLE_CREDENTIALS_BASE64 in environment.');
  }

  const credentials = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};

app.post('/api/messages', async (req, res) => {
  try {
    const { message } = req.body ?? {};
    const trimmed = typeof message === 'string' ? message.trim() : '';

    if (!trimmed) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      return res.status(500).json({ error: 'Missing GOOGLE_SHEETS_ID in environment.' });
    }

    const range = 'Sheet1'
    const sheets = await getSheetsClient();
    const now = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[now, trimmed]],
      },
    });

    return res.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to append message.';
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`Message API listening on http://localhost:${port}`);
});
