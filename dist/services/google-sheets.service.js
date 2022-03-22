"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSheetsService = void 0;
const song_model_1 = require("../model/song.model");
class GoogleSheetsService {
    constructor(googleSheetsClient) {
        this.sheetsClient = googleSheetsClient;
    }
    /**
     * Returns array of valid Song objects as retrieved from Google Sheets.
     *
     * @param filter - Any filters to apply against the song list.
     * @returns Array of Song objects.
     */
    getSongs(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const sheet = 'Sheet1';
            const range = 'A1:H173';
            const rows = yield this.sheetsClient.get(sheet, range);
            const headerRow = rows.shift();
            const songs = [];
            // For each row, convert into a Song.
            rows.forEach((row) => {
                const song = new song_model_1.Song(headerRow, row);
                songs.push(song);
            });
            return this.applyFilter(songs, filter);
        });
    }
    /**
     * Apply provided filters against returned song list.
     *
     * @param results - The list of songs against which to apply filters.
     * @param filter - The filters to apply.
     * @returns Filtered list of songs.
     */
    applyFilter(results, filter) {
        if (filter.title)
            results = results.filter(song => song.title === filter.title);
        if (filter.artist)
            results = results.filter(song => song.artists.includes(filter.artist));
        if (filter.writer)
            results = results.filter(song => song.writers.includes(filter.writer));
        if (filter.album)
            results = results.filter(song => song.album === filter.album);
        if (filter.year)
            results = results.filter(song => song.year === filter.year);
        return results;
    }
}
exports.GoogleSheetsService = GoogleSheetsService;
//# sourceMappingURL=google-sheets.service.js.map