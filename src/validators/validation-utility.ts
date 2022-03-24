export abstract class ValidationUtility {

    /**
     * Sanitise comma-separated string into array of strings.
     * 
     * @param value - Comma-separated string.
     * @returns The array of strings representing the original comma-separated string.
     */
    static sanitiseIntoArray(value: string): Array<string> {
        const array = value.split(',');
        return array.map(item => item.trim());
    }

    /**
     * Sanitise string value into number.
     * 
     * @param value String number to convert to number.
     * @returns The numberic version of the string value.
     */
    static sanitiseIntoNumber(value: string): number {
        return parseInt(value);
    }
}