import { MonthlyPlays } from "./song-monthly-plays.model";

export class Song {
    // TODO: is there a way to make this more dynamic rather than fixed to column names?
    private readonly title?: string;
    private readonly artists?: string;
    private readonly writers?: string;
    private readonly album?: string;
    private readonly year?: number;
    private readonly plays?: MonthlyPlays;

    constructor(header?: Array<string>, row?: Array<string>) {
        this.title = this.getValueByColumnName(header, row, 'Song');
        this.artists = this.getValueByColumnName(header, row, 'Artist');
        this.writers = this.getValueByColumnName(header, row, 'Writer');
        this.album = this.getValueByColumnName(header, row, 'Album');
        this.year = +this.getValueByColumnName(header, row, 'Year');
        this.plays.june = +this.getValueByColumnName(header, row, 'Plays - June');
        this.plays.july = +this.getValueByColumnName(header, row, 'Plays - July');
        this.plays.august = +this.getValueByColumnName(header, row, 'Plays - August');
    }

    /**
     * Return value from `row` string array located at the index of the desired `column` name in the `header` string array.
     * 
     * @param header - The array from which to find the index of the provided `column` name.
     * @param row - The array from which to find value at same index as provided `column` in `header` array.
     * @param column - The desired `column` name to find from the `header` array.
     * @returns String at index of desired `column` in `header` array, as found in the `row` array.
     */
    private getValueByColumnName(header: Array<string>, row: Array<string>, column: string): string {
        const columnIndex = header.indexOf(column);
        return row[columnIndex];
    }
}