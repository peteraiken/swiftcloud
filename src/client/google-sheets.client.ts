import { google, sheets_v4 } from 'googleapis';

export class GoogleSheetsClient {
    private readonly sheet = google.sheets('v4');
    private readonly sheetId: string;
    
    constructor();
    constructor(sheetId: string);
    constructor(sheetId?: string) {
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
    async get(tab: string, range: string, dimension?: 'ROWS' | 'COLUMNS'): Promise<Array<Array<string>>> {
        const request = this.createRequest(tab, range, dimension);
        const response = await this.sheet.spreadsheets.values.get(request);

        return response.data.values;
    }

    /**
     * Creates compatible object to represent Google Sheets API request.
     * 
     * @param tab - The tab in the spreadsheet to target.
     * @param range - The range to query.
     * @param dimension - The major dimension to indicate return in either rows or columns. Defaults to ROWS.
     * @returns Compatible Google Sheets API request object.
     */
    private createRequest(tab: string, range: string, dimension = 'ROWS'): sheets_v4.Params$Resource$Spreadsheets$Values$Get {
        return {
            spreadsheetId: this.sheetId,
            range: `${tab}!${range}`,
            majorDimension: dimension,
            key: process.env.GOOGLE_SHEETS_API_KEY
        }
    }
}