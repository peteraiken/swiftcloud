export interface SongFilter {
    // General
    title?: string;
    album?: string;

    // Artists
    artists?: Array<string>;
    minArtists?: number;
    maxArtists?: number;

    // Writers
    writers?: Array<string>;
    minWriters?: number;
    maxWriters?: number;
    
    // Years
    year?: number;
    startYear?: number;
    endYear?: number;

    // Play Counts
    minTotalPlays?: number;
    maxTotalPlays?: number;
}