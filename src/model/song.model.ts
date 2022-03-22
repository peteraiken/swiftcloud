import { MonthlyPlays } from "./song-monthly-plays.model";

export class Song {
    // TODO: is there a way to make this more dynamic rather than fixed to column names?
    private readonly _song?: string;
    private readonly _artist?: string;
    private readonly _writer?: string;
    private readonly _album?: string;
    private readonly _year?: string;
    private readonly _playsJune?: string;
    private readonly _playsJuly?: string;
    private readonly _playsAugust?: string;

    constructor(header?: Array<string>, row?: Array<string>) {
        this._song = this.getValueByColumnName(header, row, 'Song');
        this._artist = this.getValueByColumnName(header, row, 'Artist');
        this._writer = this.getValueByColumnName(header, row, 'Writer');
        this._album = this.getValueByColumnName(header, row, 'Album');
        this._year = this.getValueByColumnName(header, row, 'Year');
        this._playsJune = this.getValueByColumnName(header, row, 'Plays - June');
        this._playsJuly = this.getValueByColumnName(header, row, 'Plays - July');
        this._playsAugust = this.getValueByColumnName(header, row, 'Plays - August');
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

    //#region Getters

    get title(): string { return this._song };
    get artists(): Array<string> { return this._artist.split('\n'); };
    get writers(): Array<string> { return this._writer.split('\n'); };
    get album(): string { return this._album };
    get year(): number { return +this._year };
    get plays(): MonthlyPlays {
        return {
            june: +this._playsJune,
            july: +this._playsJuly,
            august: +this._playsAugust,
        }
    };

    //#endregion Getters

    toViewObject = () => {
        return {}
    }
}