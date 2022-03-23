import BaseModel from "./base.model";
import { MonthlyPlays } from "./song-monthly-plays.model";

export class Song extends BaseModel {
    title?: string;
    artists?: Array<string>;
    writers?: Array<string>;
    album?: string;
    year?: number;
    plays: MonthlyPlays;
}