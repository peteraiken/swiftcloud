import { GoogleSheetsClient } from "../client/google-sheets.client";
import { SongFilter } from "../model/song-filter.model";
import { MonthlyPlays } from "../model/song-monthly-plays.model";
import { Song } from "../model/song.model";
import { GoogleSheetsParserService } from "../parser/google-sheets-parser.service";
import { SongService } from "./song.service";

// Constants
const songs: Array<Song> = [
    { title: 'Song 1', artists: ['Artist A'], year: 2020, plays: { june: 2 } as MonthlyPlays },
    { title: 'Song 2', artists: ['Artist A', 'Artist B'], year: 2016, plays: { july: 1, august: 4 } as MonthlyPlays },
    { title: 'Song 3', artists: ['Artist B'], year: 2018, plays: { june: 1, july: 2 } as MonthlyPlays }
];

// Services
const sheetsClient = new GoogleSheetsClient();
const parserService = new GoogleSheetsParserService();

// Mocks and Spies
jest.spyOn(sheetsClient, 'get').mockImplementation();

// Service under Test
const service = new SongService(sheetsClient, parserService);

beforeEach(() => {
    jest.clearAllMocks();
});

describe('getSongs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('With no filter, get all songs', async () => {
        // Arrange
        const parseRowsSpy = jest.spyOn(parserService, 'parseRowsToObject').mockReturnValue(songs);

        // Act
        const response = await service.getSongs();

        // Assert
        expect(response.length).toEqual(3);
        expect(response[0].title).toEqual('Song 1');
        expect(response[1].title).toEqual('Song 2');
        expect(response[2].title).toEqual('Song 3');

        expect(parseRowsSpy).toHaveBeenCalled();
    });

    test('With year filter, only return songs matching the year provided', async () => {
        // Arrange
        const filter: SongFilter = {
            year: 2020
        };
        const parseRowsSpy = jest.spyOn(parserService, 'parseRowsToObject').mockReturnValue(songs);

        // Act
        const response = await service.getSongs(filter);

        // Assert
        expect(response.length).toEqual(1);
        expect(response[0].title).toEqual('Song 1');

        expect(parseRowsSpy).toHaveBeenCalled();
    });

    test('With artists array filter, only return songs with matching artists', async () => {
        // Arrange
        const filter: SongFilter = {
            artist: ['Artist B']
        };
        const parseRowsSpy = jest.spyOn(parserService, 'parseRowsToObject').mockReturnValue(songs);

        // Act
        const response = await service.getSongs(filter);

        // Assert
        expect(response.length).toEqual(2);
        expect(response[0].title).toEqual('Song 2');
        expect(response[1].title).toEqual('Song 3');

        expect(parseRowsSpy).toHaveBeenCalled();
    });

    test('If no matching filters, return empty array', async () => {
        // Arrange
        const filter: SongFilter = {
            minTotalPlays: 10
        };
        const parseRowsSpy = jest.spyOn(parserService, 'parseRowsToObject').mockReturnValue(songs);

        // Act
        const response = await service.getSongs(filter);

        // Assert
        expect(response.length).toEqual(0);

        expect(parseRowsSpy).toHaveBeenCalled();
    });

    test('If calling with sort, return songs ordered in provided order', async () => {
        // Arrange
        const sortPredicate = ((a: Song, b: Song) => b.year - a.year);
        const parseRowsSpy = jest.spyOn(parserService, 'parseRowsToObject').mockReturnValue(songs);

        // Act
        const response = await service.getSongs(null, sortPredicate);

        // Assert
        expect(response.length).toEqual(3);
        expect(response[0].year).toEqual(2020);
        expect(response[1].year).toEqual(2018);
        expect(response[2].year).toEqual(2016);

        expect(parseRowsSpy).toHaveBeenCalled();
    });
});

describe('getSong', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('With multiple songs matching filters and sort, just return first in sorted list', async () => {
        // Arrange
        const filter: SongFilter = {
            artist: ['Artist A']
        };
        const parseRowsSpy = jest.spyOn(parserService, 'parseRowsToObject').mockReturnValue(songs);

        // Act
        const response = await service.getSong(filter);

        // Assert
        expect(response.title).toEqual('Song 1');

        expect(parseRowsSpy).toHaveBeenCalled();
    });
});

describe('getSongTitlesByDateRange', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Return list of string song summary for songs released between date range', async () => {
        // Arrange
        const parseRowsSpy = jest.spyOn(parserService, 'parseRowsToObject').mockReturnValue(songs);

        // Act
        const response = await service.getSummaryByDateRange(2016, 2018);

        // Assert
        expect(response.length).toEqual(2);
        expect(response[0]).toEqual(`Song 2 - Artist A, Artist B (2016)`);
        expect(response[1]).toEqual(`Song 3 - Artist B (2018)`);

        expect(parseRowsSpy).toHaveBeenCalled();
    });
});