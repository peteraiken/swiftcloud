import { GoogleSheetsClient } from "../client/google-sheets.client";
import { SongFilter } from "../model/song-filter.model";
import { Song } from "../model/song.model";

export class GoogleSheetsService {
    private readonly sheetsClient: GoogleSheetsClient;

    constructor();
    constructor(googleSheetsClient: GoogleSheetsClient);
    constructor(googleSheetsClient?: GoogleSheetsClient) {
        this.sheetsClient = googleSheetsClient;
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
        
        const headerRow = rows.shift();
        const songs: Array<Song> = [];

        // For each row, convert into a Song.
        rows.forEach((row) => {
            const song = new Song(headerRow, row);
            songs.push(song);
        });

        return this.applyFilter(songs, filter);
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