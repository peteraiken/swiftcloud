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
    async (request, response, next) => {
        try { 
            const filter: SongFilter = buildFilters(request.query);
            response.send(await sheetsService.getSong(filter));
        } catch (error) {
            next(error);
        }
    }
);

app.get('/songs', validateParameters([getSongsByFilterValidator]),
    async (request, response, next) => {
        try {
            const filter: SongFilter = buildFilters(request.query);
            response.send(await sheetsService.getSongs(filter));
        } catch (error) {
            next(error);
        }
    }
);

app.get('/summary/year/start/:start/end/:end',
    validateParameters([summaryByYearRangeValidator]),
    async (request, response, next) => {
        try {
            const start = request.params.start as unknown as number;
            const end = request.params.end as unknown as number;
            response.send(await sheetsService.getSummaryByDateRange(start, end));
        } catch (error) {
            next(error);
        }
    }
);

app.get('/summary/collabs/artists',
    async (request, response, next) => {
        try {
            response.send(await sheetsService.getSummaryByMultipleArtists());
        } catch (error) {
            next(error);
        }
    }
);

app.get('/summary/collabs/writers',
    async (request, response, next) => {
        try {
            response.send(await sheetsService.getSummaryByMultipleWriters());
        } catch (error) {
            next(error);
        }
    }
);

app.get('/songs/top',
    async (request, response, next) => {
        try {
            response.send(await sheetsService.getTopSongs());
        } catch (error) {
            next(error);
        }
    }
);

app.get('/songs/top/months/:months',
    validateParameters([paramMonthValidator]),
    async (request, response, next) => {
        try {
            const months = request.params.months as unknown as Array<string>;
            response.send(await sheetsService.getTopSongs(months));
        } catch (error) {
            next(error);
        }
    }
);

/**
 * Handling any API errors.
 */
app.use((error, request, response, next) => {
    console.log(`An error has occurred:`, error);
    response.status(500).send(`Something has gone wrong. - ${error.message || 'unknown error.'}`);
})

/**
 * Build valid song filter object from parameters.
 * 
 * @param params - The query string parameters from which to build the filter object.
 * @returns Song Filter object.
 */
function buildFilters(params): SongFilter {
    return {
        title: params['title'] as string,
        artists: (params['artists'] as Array<string>),
        minArtists: params['minArtists'] as number,
        maxArtists: params['maxArtists'] as number,
        writers: (params['writers'] as Array<string>),
        minWriters: params['minWriters'] as number,
        maxWriters: params['maxWriters'] as number,
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