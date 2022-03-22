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
exports.GoogleSheetsClient = void 0;
const googleapis_1 = require("googleapis");
class GoogleSheetsClient {
    constructor(sheetId) {
        this.sheet = googleapis_1.google.sheets('v4');
        this.sheetId = sheetId;
    }
    /**
     * Sends a GET request to the provided tab and range, and returns the result in the dimension provided.
     *
     * @param tab The tab in the spreadsheet to target.
     * @param range - The range to query.
     * @param dimension - The major dimension to indicate return in either rows or columns.
     * @returns Response of GET query request from Google Sheets API.
     */
    get(tab, range, dimension) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = this.createRequest(tab, range, dimension);
            const response = yield this.sheet.spreadsheets.values.get(request);
            return response.data.values;
        });
    }
    /**
     * Creates compatible object to represent Google Sheets API request.
     *
     * @param tab - The tab in the spreadsheet to target.
     * @param range - The range to query.
     * @param dimension - The major dimension to indicate return in either rows or columns. Defaults to ROWS.
     * @returns Compatible Google Sheets API request object.
     */
    createRequest(tab, range, dimension = 'ROWS') {
        return {
            spreadsheetId: this.sheetId,
            range: `${tab}!${range}`,
            majorDimension: dimension,
            key: process.env.GOOGLE_SHEETS_API_KEY
        };
    }
}
exports.GoogleSheetsClient = GoogleSheetsClient;
//# sourceMappingURL=google-sheets.client.js.map