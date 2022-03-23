import express from 'express';
import serverless from 'serverless-http';
import { GoogleSheetsClient } from './client/google-sheets.client';
import { SongFilter } from './model/song-filter.model';
import { GoogleSheetsParserService } from './parser/google-sheets-parser.service';
import { SongService } from './services/song.service';
const app = express();
const port = 3000;

const sheetsClient = new GoogleSheetsClient(process.env.GOOGLE_SHEETS_SHEET_ID);
const parserService = new GoogleSheetsParserService();
const sheetsService = new SongService(sheetsClient, parserService);

app.get('/songs', async (request, response) => {
    const params = request.query;
    const filter: SongFilter = {
        title: params['title'] as string,
        artist: (params['artist'] as string)?.split(','),
        writer: (params['writer'] as string)?.split(','),
        album: params['album'] as string,
        year: parseInt(params['year'] as string),
        minTotalPlays: parseInt(params['minPlays'] as string),
        maxTotalPlays: parseInt(params['maxPlays'] as string)
    };

    response.send(await sheetsService.getSongs(filter));
});

export const handler = serverless(app);

// app.get('/songs/month/:month', async (request, response) => {
//     response.send(await sheetsService.getSongsByMonth(request.query['month']));
// });

// app.listen(port, () => {
//     return console.log(`App is running at http://localhost:${port}`);
// });