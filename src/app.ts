import express from 'express';
import { validationResult } from 'express-validator';
import serverless from 'serverless-http';
import { GoogleSheetsClient } from './client/google-sheets.client';
import { SongFilter } from './model/song-filter.model';
import { GoogleSheetsParserService } from './parser/google-sheets-parser.service';
import { SongService } from './services/song.service';
import { getSongsByFilterValidator } from './validators/song.validator';
import { paramMonthValidator, summaryByYearRangeValidator } from './validators/summary.validator';
const app = express();
app.use(express.json());

const sheetsClient = new GoogleSheetsClient(process.env.GOOGLE_SHEETS_SHEET_ID);
const parserService = new GoogleSheetsParserService();
const sheetsService = new SongService(sheetsClient, parserService);

app.get('/song',
    validateParameters([getSongsByFilterValidator]),
    async (request, response) => {
        const filter: SongFilter = buildFilters(request.query)
        response.send(await sheetsService.getSong(filter));
    }
);

app.get('/songs', validateParameters([getSongsByFilterValidator]),
    async (request, response) => {
        const filter: SongFilter = buildFilters(request.query)
        response.send(await sheetsService.getSongs(filter));
    }
);

app.get('/summary/year/start/:start/end/:end',
    validateParameters([summaryByYearRangeValidator]),
    async (request, response) => {
        const start = request.params.start as unknown as number;
        const end = request.params.end as unknown as number;
        response.send(await sheetsService.getSummaryByDateRange(start, end));
    }
);

app.get('/summary/collabs/artists',
    async (request, response) => {
        response.send(await sheetsService.getSummaryByMultipleArtists());
    }
);

app.get('/summary/collabs/writers',
    async (request, response) => {
        response.send(await sheetsService.getSummaryByMultipleWriters());
    }
);

app.get('/songs/top',
    async (request, response) => {
        response.send(await sheetsService.getTopSongs());
    }
);

app.get('/songs/top/months/:months',
    validateParameters([paramMonthValidator]),
    async (request, response) => {
        const months = request.params.months as unknown as Array<string>;
        response.send(await sheetsService.getTopSongs(months));
    }
);

/**
 * Build valid song filter object from parameters.
 * 
 * @param params - The query string parameters from which to build the filter object.
 * @returns Song Filter object.
 */
function buildFilters(params): SongFilter {
    return {
        title: params['title'] as string,
        artist: (params['artists'] as Array<string>),
        writer: (params['writers'] as Array<string>),
        album: params['album'] as string,
        year: params['year'] as number,
        startYear: params['start'] as number,
        endYear: params['end'] as number,
        minTotalPlays: params['minPlays'] as number,
        maxTotalPlays: params['maxPlays'] as number
    };
}

/**
 * Apply provided validators to endpoint and return errors if they occur.
 * 
 * @param validators - Array of ValidationChains used to validate the request.
 * @returns Handler to apply provided validators against the request.
 */
function validateParameters(validators) {
    const handler = (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({errors: errors.array()});
        next();
    }
    validators.push(handler);
    return validators;
}

export const handler = serverless(app);

if (process.env.ENVIRONMENT === 'local') {
    const port = 3000;
    app.listen(port, () => {
        return console.log(`App is running at http://localhost:${port}`);
    });
}