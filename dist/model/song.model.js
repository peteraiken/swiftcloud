"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Song = void 0;
class Song {
    constructor(header, row) {
        //#endregion Getters
        this.toViewObject = () => {
            return {};
        };
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
    getValueByColumnName(header, row, column) {
        const columnIndex = header.indexOf(column);
        return row[columnIndex];
    }
    //#region Getters
    get title() { return this._song; }
    ;
    get artists() { return this._artist.split('\n'); }
    ;
    get writers() { return this._writer.split('\n'); }
    ;
    get album() { return this._album; }
    ;
    get year() { return +this._year; }
    ;
    get plays() {
        return {
            june: +this._playsJune,
            july: +this._playsJuly,
            august: +this._playsAugust,
        };
    }
    ;
}
exports.Song = Song;
//# sourceMappingURL=song.model.js.map