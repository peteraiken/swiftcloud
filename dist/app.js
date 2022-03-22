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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const google_sheets_client_1 = require("./client/google-sheets.client");
const google_sheets_service_1 = require("./services/google-sheets.service");
const app = (0, express_1.default)();
const port = 3000;
const sheetsClient = new google_sheets_client_1.GoogleSheetsClient(process.env.GOOGLE_SHEETS_SHEET_ID);
const sheetsService = new google_sheets_service_1.GoogleSheetsService(sheetsClient);
app.get('/songs', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const params = request.query;
    const filter = {
        title: params['title'],
        artist: params['artist'],
        writer: params['writer'],
        album: params['album'],
        year: parseInt(params['year'])
    };
    response.send(yield sheetsService.getSongs(filter));
}));
app.listen(port, () => {
    return console.log(`App is running at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map