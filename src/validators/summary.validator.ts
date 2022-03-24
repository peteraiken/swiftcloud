import { param } from "express-validator";
import { ValidationUtility } from "./validation-utility";

const paramStartValidator =
    param('start', '\'start\' must be provided.')
        .exists()
        .bail()
        .isNumeric()
        .withMessage('\'start\' must be a valid whole number.')
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoNumber);

const paramEndValidator =
    param('end', '\'end\' must be provided.')
        .exists()
        .bail()
        .isNumeric()
        .withMessage('\'end\' must be a valid whole number.')
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoNumber);

export const summaryByYearRangeValidator = [
    paramStartValidator,
    paramEndValidator
];

export const paramMonthValidator =
    param('months', '\'months\' must be provided.')
        .exists()
        .bail()
        .isString()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoArray);