export class MonthlyPlays {
    june: number;
    july: number;
    august: number;

    get totalPlays(): number {
        return this.june + this.july + this.august;
    }
}