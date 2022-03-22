import { GoogleSheetsClient } from "../client/google-sheets.client";
import { Song } from "../model/song.model";

export class GoogleSheetsService {
    private readonly sheetsClient: GoogleSheetsClient;

    constructor();
    constructor(googleSheetsClient: GoogleSheetsClient);
    constructor(googleSheetsClient?: GoogleSheetsClient) {
        this.sheetsClient = googleSheetsClient;
    }

    async getRows() {
        const sheet = 'Sheet1';
        const range = 'A1:H173';
        const rows = await this.sheetsClient.get(sheet, range);
        
        const headerRow = rows.shift();
        const songs: Array<Song> = [];
        rows.forEach((row) => {
            const song= new Song(headerRow, row);
            songs.push(song);
        });

        return songs;
    }
}