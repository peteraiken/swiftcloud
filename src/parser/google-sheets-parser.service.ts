import BaseModel from "../model/base.model";
import { Song } from "../model/song.model";
import SongBuilder from "./song.builder";

export class GoogleSheetsParserService {

    /**
     * Generic method to parse Google Sheets string array data into specified object.
     * 
     * @param rows - The Sheets string array data, including column names.
     * @param targetType - The object type into which to convert the Sheets data.
     * @returns Array of specified objects.
     */
    parseRowsToObject<T extends BaseModel>(rows: Array<Array<string>>, targetType: T) {
        const header = rows.shift();

        switch(targetType) {
            case Song as any:
                return this.parseRowsToSongs(header, rows);
            default:
                throw new Error(`Invalid type requested: ${typeof targetType}`);
        }
    }

    /**
     * Generate new song objects representing each row in the data and return array of songs.
     * 
     * @param header - The header column names.
     * @param rows - The row values.
     * @returns Array of songs representing each row.
     */
    private parseRowsToSongs(header: Array<string>, rows: Array<Array<string>>): Array<Song> {
        const builder = new SongBuilder();
        const results: Array<Song> = [];
        rows.forEach((row) => {
            const song = builder.initialise(header, row);
            results.push(song);
        });
        return results;
    }
}