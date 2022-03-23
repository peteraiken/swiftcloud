export interface SongFilter {
    title?: string;
    artist?: Array<string>;
    writer?: Array<string>;
    album?: string;
    year?: number;
    minTotalPlays?: number;
    maxTotalPlays?: number;
}