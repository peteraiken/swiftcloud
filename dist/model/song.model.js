"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Song = void 0;
class Song {
    constructor(header, row) {
        var _a, _b;
        if (header && row) {
            // Direct mapping.
            this.title = this.getValueByColumnName(header, row, 'Song');
            this.album = this.getValueByColumnName(header, row, 'Album');
            // Splitting multi-line values into string arrays.
            this.artists = (_a = this.getValueByColumnName(header, row, 'Artist')) === null || _a === void 0 ? void 0 : _a.split('\n');
            this.writers = (_b = this.getValueByColumnName(header, row, 'Writer')) === null || _b === void 0 ? void 0 : _b.split('\n');
            this.year = parseInt(this.getValueByColumnName(header, row, 'Year')) || null;
            // Splitting values into numeric plays-per-month.
            this.plays = {
                june: parseInt(this.getValueByColumnName(header, row, 'Plays - June')) || null,
                july: parseInt(this.getValueByColumnName(header, row, 'Plays - July')) || null,
                august: parseInt(this.getValueByColumnName(header, row, 'Plays - August')) || null
            };
        }
    }
    /**
     * Finds index of `column` provided in `header` array, then finds the value at that index in the `row` array.
     * Designed to map row values against appropriate column (and property) names.
     *
     * @param header - The array of column names.
     * @param row - The array of values per column.
     * @param column - The desired `column` name to find from the `header` array.
     * @returns String at index of desired `column` in `header` array, as found in the `row` array.
     */
    getValueByColumnName(header, row, column) {
        // If the requested column is not in the list of columns, return null.
        if (!header.includes(column))
            return null;
        const columnIndex = header.indexOf(column);
        const value = row[columnIndex];
        if (!value)
            return null;
        return value;
    }
}
exports.Song = Song;
//# sourceMappingURL=song.model.js.map