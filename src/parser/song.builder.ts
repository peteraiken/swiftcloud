import { MonthlyPlays } from "../model/song-monthly-plays.model";
import { Song } from "../model/song.model";
import BaseBuilder from "./base.builder";

export default class SongBuilder extends BaseBuilder<Song> {

    /**
     * Parse string array format from Google Sheets into valid Song object.
     * 
     * @param header - The string array of column names.
     * @param row - The string array of row values.
     * @returns New song object.
     */
    initialise(header: Array<string>, row: Array<string>): Song {
        if (header.length === 0) throw new Error(`Column header values must be provided.`);

        // Direct mapping.
        const title = this.getValueByColumnName(header, row, 'Song');
        const album = this.getValueByColumnName(header, row, 'Album');
        
        // Splitting multi-line values into string arrays.
        const artists = this.getValueByColumnName(header, row, 'Artist')?.split('\n') || null;
        const writers = this.getValueByColumnName(header, row, 'Writer')?.split('\n') || null;
        const year = parseInt(this.getValueByColumnName(header, row, 'Year')) || null;

        // Splitting values into numeric plays-per-month.
        const plays = new MonthlyPlays();
        plays.june = parseInt(this.getValueByColumnName(header, row, 'Plays - June')) || null;
        plays.july = parseInt(this.getValueByColumnName(header, row, 'Plays - July')) || null;
        plays.august = parseInt(this.getValueByColumnName(header, row, 'Plays - August')) || null;

        return {
            title: title,
            artists: artists,
            writers: writers,
            album: album,
            year: year,
            plays: plays
        }
    }
}