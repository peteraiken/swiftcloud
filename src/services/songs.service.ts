import { GoogleSheetsClient } from "../client/google-sheets.client";
import { SongFilter } from "../model/song-filter.model";
import { Song } from "../model/song.model";
import { GoogleSheetsParserService } from "../parser/google-sheets-parser.service";

export class GoogleSheetsService {
    private readonly sheetsClient: GoogleSheetsClient;
    private readonly parserService: GoogleSheetsParserService;

    constructor();
    constructor(googleSheetsClient: GoogleSheetsClient, googleSheetsParserService: GoogleSheetsParserService);
    constructor(googleSheetsClient?: GoogleSheetsClient, googleSheetsParserService?: GoogleSheetsParserService) {
        this.sheetsClient = googleSheetsClient;
        this.parserService = googleSheetsParserService;
    }

    /**
     * Returns array of valid Song objects as retrieved from Google Sheets.
     * 
     * @param filter - Any filters to apply against the song list.
     * @returns Array of Song objects.
     */
    async getSongs(filter?: SongFilter, sort?: (a: Song, b: Song) => number): Promise<Array<Song>> {
        const sheet = 'Sheet1';
        const range = 'A:H';
        const rows = await this.sheetsClient.get(sheet, range);

        const results = this.parserService.parseRowsToObject(rows, Song);        
        return this.applyPredicates(results, filter, sort);
    }

    /**
     * Apply provided filters against returned song list.
     * 
     * @param results - The list of songs against which to apply filters.
     * @param filter - The filters to apply.
     * @returns Filtered list of songs.
     */
    private applyPredicates(results: Array<Song>, filter: SongFilter, sort: (a: Song, b: Song) => number): Array<Song> {
        if (filter.title) results = results.filter(song => song.title === filter.title);
        if (filter.artist) results = results.filter(song => song.artists.some(artist => filter.artist.includes(artist)));
        if (filter.writer) results = results.filter(song => song.writers.some(writer => filter.writer.includes(writer)));
        if (filter.album) results = results.filter(song => song.album === filter.album);
        if (filter.year) results = results.filter(song => song.year === filter.year);
        if (filter.minTotalPlays) results = results.filter(song => song.plays.totalPlays >= filter.minTotalPlays);
        if (filter.maxTotalPlays) results = results.filter(song => song.plays.totalPlays <= filter.maxTotalPlays);

        return results.sort(sort);
    }
}