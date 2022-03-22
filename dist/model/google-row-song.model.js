"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleRowSong = void 0;
class GoogleRowSong {
    constructor(header, row) {
        this.song = this.getValueByColumnName(header, row, 'Song');
        this.artist = this.getValueByColumnName(header, row, 'Artist');
        this.writer = this.getValueByColumnName(header, row, 'Writer');
        this.album = this.getValueByColumnName(header, row, 'Album');
        this.year = this.getValueByColumnName(header, row, 'Year');
        this.playsJune = this.getValueByColumnName(header, row, 'Plays - June');
        this.playsJuly = this.getValueByColumnName(header, row, 'Plays - July');
        this.playsAugust = this.getValueByColumnName(header, row, 'Plays - August');
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
}
exports.GoogleRowSong = GoogleRowSong;
//# sourceMappingURL=google-row-song.model.js.map