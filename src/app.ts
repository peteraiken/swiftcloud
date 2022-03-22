import express from 'express';
import { GoogleSheetsClient } from './client/google-sheets.client';
import { GoogleSheetsService } from './services/google-sheets.service';
const app = express();
const port = 3000;

const sheetsClient = new GoogleSheetsClient(process.env.GOOGLE_SHEETS_SHEET_ID);
const sheetsService = new GoogleSheetsService(sheetsClient);

app.get('/', async (request, response) => {
    response.send(await sheetsService.getRows());
});

app.listen(port, () => {
    return console.log(`App is running at http://localhost:${port}`);
});