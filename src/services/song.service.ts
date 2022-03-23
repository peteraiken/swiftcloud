import { GoogleSheetsClient } from "../client/google-sheets.client";
import { SongFilter } from "../model/song-filter.model";
import { Song } from "../model/song.model";
import { GoogleSheetsParserService } from "../parser/google-sheets-parser.service";

export class SongService {
    private readonly sheetsClient: GoogleSheetsClient;
    private readonly parserService: GoogleSheetsParserService;
    private readonly mainSheet = 'Sheet1';
    private readonly completeRange = 'A:H';

    constructor();
    constructor(googleSheetsClient: GoogleSheetsClient, googleSheetsParserService: GoogleSheetsParserService);
    constructor(googleSheetsClient?: GoogleSheetsClient, googleSheetsParserService?: GoogleSheetsParserService) {
        this.sheetsClient = googleSheetsClient;
        this.parserService = googleSheetsParserService;
    }

    /**
     * Returns array of valid songs matching provided filters.
     * 
     * @param filter - Any filters to apply against the song list.
     * @param sort - Any sorting predicate to apply to the array of songs.
     * @returns Array of Song objects.
     */
    async getSongs(filter?: SongFilter, sort?: (a: Song, b: Song) => number): Promise<Array<Song>> {
        const results = await this.getAndParseSongRows();
        return this.applyPredicates(results, filter, sort);
    }

    /**
     * Gets singular song matching provided filters.
     * 
     * @param filter - Any filters to apply against the song list.
     * @param sort - Any sorting predicate to apply to the array of songs.
     * @returns Song object.
     */
    async getSong(filter: SongFilter): Promise<Song> {
        const results = await this.getAndParseSongRows();
        const filteredResults = this.applyPredicates(results, filter, null, 1);
        return filteredResults[0];
    }

    /**
     * Gets list of song titles for songs released between two years.
     * 
     * @param startYear - The start of the year range.
     * @param endYear - The end of the year range.
     * @returns List of song titles for songs released in date range.
     */
    async getSongListByDateRange(startYear: number, endYear: number): Promise<Array<string>> {
        const filter = { startYear: startYear, endYear: endYear};
        const sort = (a: Song, b: Song) => a.year - b.year;
        const results = await this.getSongs(filter, sort);
        return results.map(song => song.title);
    }

    /**
     * Gets list of song titles for songs with multiple artists.
     * 
     * @returns List of song titles for songs with multiple artists.
     */
    async getSongListWithMultipleArtists(): Promise<Array<string>> {
        const results = await this.getSongs();
        return results.filter((song) => song.artists.length > 1).map(song => song.title);
    }

    /**
     * Gets list of song titles for songs with multiple writers.
     * 
     * @returns List of song titles for songs with multiple writers.
     */
     async getSongListWithMultipleWriters(): Promise<Array<string>> {
        const results = await this.getSongs();
        return results.filter((song) => song.writers.length > 1).map(song => song.title);
    }

    //#region Supporting Methods

    /**
     * Retrieve rows from Google Sheets and parse into valid Song objects.
     * 
     * @returns Array of valid Song objects as parsed from Google Sheet rows.
     */
    private async getAndParseSongRows(): Promise<Array<Song>> {
        const rows = await this.sheetsClient.get(this.mainSheet, this.completeRange);
        return this.parserService.parseRowsToObject(rows, Song);
    }

    /**
     * Apply provided filters against returned song list.
     * 
     * @param results - The list of songs against which to apply filters.
     * @param filter - The filters to apply.
     * @param sort - The sort predicate to apply.
     * @param limit - The maximum number of songs to return.
     * @returns Filtered list of songs.
     */
    private applyPredicates(results: Array<Song>, filter?: SongFilter, sort?: (a: Song, b: Song) => number, limit?: number): Array<Song> {
        if (filter) {
            if (filter.title) results = results.filter(song => song.title === filter.title);
            if (filter.artist) results = results.filter(song => song.artists.some(artist => filter.artist.includes(artist)));
            if (filter.writer) results = results.filter(song => song.writers.some(writer => filter.writer.includes(writer)));
            if (filter.album) results = results.filter(song => song.album === filter.album);
            if (filter.year) results = results.filter(song => song.year === filter.year);
            if (filter.startYear) results = results.filter(song => song.year >= filter.startYear);
            if (filter.endYear) results = results.filter(song => song.year <= filter.endYear);
            if (filter.minTotalPlays) results = results.filter(song => song.plays.totalPlays >= filter.minTotalPlays);
            if (filter.maxTotalPlays) results = results.filter(song => song.plays.totalPlays <= filter.maxTotalPlays);
        }

        if (sort) return results.sort(sort);
        if (limit) return results.slice(0, limit);
        return results;
    }

    //#endregion Supporting Methods
}