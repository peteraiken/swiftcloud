import { query } from "express-validator";
import { ValidationUtility } from "./validation-utility";

const optionalQueryTitleValidator =
    query('title', '\'title\' must be a valid string')
        .optional()
        .isString()
        .bail();

const optionalQueryArtistsValidator =
    query('artists', '\'artists\' must be a valid array (hint: separate each artist by comma).')
        .optional()
        .isString()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoArray);

const optionalQueryMinArtistsValidator =
    query('minArtists', '\'minArtists\' must be a valid whole number.')
        .optional()
        .isNumeric()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoNumber);

const optionalQueryMaxArtistsValidator =
    query('maxArtists', '\'maxArtists\' must be a valid whole number.')
        .optional()
        .isNumeric()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoNumber);

const optionalQueryWritersValidator =
    query('writers', '\'writers\' must be a valid array (hint: separate each artist by comma).')
        .optional()
        .isString()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoArray);

const optionalQueryMinWritersValidator =
    query('minWriters', '\'minWriters\' must be a valid whole number.')
        .optional()
        .isNumeric()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoNumber);

const optionalQueryMaxWritersValidator =
    query('maxWriters', '\'maxWriters\' must be a valid whole number.')
        .optional()
        .isNumeric()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoNumber);

const optionalQueryAlbumValidator =
    query('album', '\'album\' must be a valid string.')
        .optional()
        .isString()
        .bail();

const optionalQueryYearValidator =
    query('year', '\'year\' must be a valid whole number.')
        .optional()
        .isNumeric()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoNumber);

const optionalQueryStartYearValidator =
    query('start', '\'start\' must be a valid whole number.')
        .optional()
        .isNumeric()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoNumber);

const optionalQueryEndYearValidator =
    query('end', '\'end\' must be a valid whole number.')
        .optional()
        .isNumeric()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoNumber);

const optionalQueryMinTotalPlaysValidator =
    query('minTotalPlays', '\'minTotalPlays\' must be a valid whole number.')
        .optional()
        .isNumeric()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoNumber);

const optionalQueryMaxTotalPlaysValidator =
    query('maxTotalPlays', '\'minTotalPlays\' must be a valid whole number.')
        .optional()
        .isNumeric()
        .bail()
        .customSanitizer(ValidationUtility.sanitiseIntoNumber);

export const getSongsByFilterValidator = [
    optionalQueryTitleValidator,
    optionalQueryArtistsValidator,
    optionalQueryMinArtistsValidator,
    optionalQueryMaxArtistsValidator,
    optionalQueryWritersValidator,
    optionalQueryMinWritersValidator,
    optionalQueryMaxWritersValidator,
    optionalQueryAlbumValidator,
    optionalQueryYearValidator,
    optionalQueryStartYearValidator,
    optionalQueryEndYearValidator,
    optionalQueryMinTotalPlaysValidator,
    optionalQueryMaxTotalPlaysValidator
]