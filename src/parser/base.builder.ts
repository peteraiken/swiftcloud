export default abstract class BaseBuilder<T> {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    initialise(header: Array<string>, row: Array<string>): T {
        throw new Error(`Class Builder not implemented.`);
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
    protected getValueByColumnName(header: Array<string>, row: Array<string>, column: string): string | null {
        // If the requested column is not in the list of columns, return null.
        if (!header.includes(column)) return null;

        const columnIndex = header.indexOf(column);
        const value = row[columnIndex];
        if (!value) return null;

        return value;
    }
}