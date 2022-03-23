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

app.get('/song', async (request, response) => {
    const filter: SongFilter = buildFilters(request.query)
    response.send(await sheetsService.getSong(filter));
});

app.get('/songs', async (request, response) => {
    const filter: SongFilter = buildFilters(request.query)
    response.send(await sheetsService.getSongs(filter));
});

app.get('/songs/year/start/:start/end/:end', async (request, response) => {
    const start = parseInt(request.params.start);
    const end = parseInt(request.params.end);
    response.send(await sheetsService.getSongListByDateRange(start, end));
});

app.get('/songs/collabs/artists', async (request, response) => {
    response.send(await sheetsService.getSongListWithMultipleArtists());
});

app.get('/songs/collabs/writers', async (request, response) => {
    response.send(await sheetsService.getSongListWithMultipleWriters());
});

/**
 * Build valid song filter object from parameters.
 * 
 * @param params - The query string parameters from which to build the filter object.
 * @returns Song Filter object.
 */
function buildFilters(params): SongFilter {
    return {
        title: params['title'] as string,
        artist: (params['artist'] as string)?.split(','),
        writer: (params['writer'] as string)?.split(','),
        album: params['album'] as string,
        year: parseInt(params['year'] as string),
        startYear: parseInt(params['start'] as string),
        endYear: parseInt(params['end'] as string),
        minTotalPlays: parseInt(params['minPlays'] as string),
        maxTotalPlays: parseInt(params['maxPlays'] as string)
    };
}

export const handler = serverless(app);

// app.get('/songs/month/:month', async (request, response) => {
//     response.send(await sheetsService.getSongsByMonth(request.query['month']));
// });

app.listen(port, () => {
    return console.log(`App is running at http://localhost:${port}`);
});