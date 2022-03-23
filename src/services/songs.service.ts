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
    async getSongs(filter: SongFilter): Promise<Array<Song>> {
        const sheet = 'Sheet1';
        const range = 'A1:H173';
        const rows = await this.sheetsClient.get(sheet, range);

        const results = this.parserService.parseRowsToObject(rows, Song);
        return this.applyFilter(results, filter);
    }

    /**
     * Apply provided filters against returned song list.
     * 
     * @param results - The list of songs against which to apply filters.
     * @param filter - The filters to apply.
     * @returns Filtered list of songs.
     */
    private applyFilter(results: Array<Song>, filter: SongFilter): Array<Song> {
        if (filter.title) results = results.filter(song => song.title === filter.title);
        if (filter.artist) results = results.filter(song => song.artists.includes(filter.artist));
        if (filter.writer) results = results.filter(song => song.writers.includes(filter.writer));
        if (filter.album) results = results.filter(song => song.album === filter.album);
        if (filter.year) results = results.filter(song => song.year === filter.year);

        return results;
    }
}