# swiftcloud
Welcome to SwiftCloud, the #1 App for Taylor Swifties!

This API is designed for Taylor Swift fans to query data about all of Taylor Swift's hits. There are a collection of endpoints to make use of in very flexible ways.

A [Postman](https://www.postman.com/) collection is available to import into the Postman client in the `docs/postman-api-collection.json` file, if you prefer.

## Endpoints
#### `/songs`
This endpoint will return a full list of Taylor Swift's songs, along with all the data available against each one, in an array. The endpoint is very flexible - the following filters can be appended as query string parameters:
* `title`
* `artist` - comma-separated to search for more than one artist
* `writer`- comma-separated to search for more than one writer
* `album`
* `year`
* `startYear` - used to search for songs released during or after a specific year
* `endYear` - used to search for songs released before and during a specific year
* `minTotalPlays` - the minimum total plays the song has received across the available monthly data
* `maxTotalPlays` - the maximum total plays the song has received across the available monthly data

#### `/song`
Subject to all the same filters as above, this endpoint will instead just return a singular song - the first song alphabetically that matches the provided filters.

#### `/songs/year/start/{end}/end/{end}`
Returns a string summary of the songs released between the provided `{start}` year and the provided `{end}` year, inclusively. This functionality is similar to `/songs/startYear={start}&endYear={end}`, but will return in summary format, i.e.:
`{Song Title} - {Artist1}, {Artist2} ({Year})`

#### `/songs/collabs/artists`
Returns a string summary of songs which were performed by two or more artists.

#### `/songs/collabs/writers`
Returns a string summary of songs which were written by two or more writers.

#### `/songs/top`
Returns full list of songs, sorted by total plays across all available monthly data in descending order.

#### `/songs/top/month/{months}`
Returns full list of songs, sorted by total plays across just the provided months in descending order. `{months}` should be comma-separated, such as `/month/june,july`.

### Validation
Each endpoint has validation applied against it using [express-validator.js](https://express-validator.github.io/docs/) - see `song.validator.ts` for an example. These will mainly check for two things among the request parameters / query strings:
1. If the parameter is required, ensure that it has been provided and is of the expected data-type
2. If the parameter is optional, ensure that, if it has been provided, it is of the expected data-type
For example, calling `/songs?year=test`, will throw an error back indicating that `year must be a valid whole number`. However in this endpoint, `year` is optional, so you can still call `/songs` without issue.
After validating that the parameters are of valid types, the validators will then impose sanitisation on some of the inputs. Namely, it will directly convert any values that are expected to be numeric into `number` data-types, and any values that are expected to be `Array<string>`s into an array of strings separated by comma. This ensures the parameters and query strings are reaching the controller in the correct data-type, and abstracts all conversion functionality away from the controller level.

## Technical Information
This API is hosted in AWS Lambda functions, built and deployed using [Serverless](https://www.serverless.com/). The deployment infrastructure-as-code can be viewed in the `serverless.yml` file. The deployment is invoked via [GitHub Actions](https://github.com/peteraiken/swiftcloud/actions), which installs packages, builds the app, runs linting and unit tests, before finally deploying via Serverless to AWS.
The Lambda functions are abstracted behind an API Gateway, capable of restricting requests to specific paths and methods. I have not implemented restrictions in this way, given the non-sensitive nature of the information at this time. All logging is stored and persisted in AWS CloudWatch.

The core data is being read via the [Google Sheets API](https://developers.google.com/sheets/api), authenticated under my personal API key, although I would have liked to create a service account to handle this instead. Ideally, I would have liked to migrate this data to DynamoDB and read the data directly from there, but decided not to when considering the time it may take to implement this. Nonetheless, I abstracted the process of reading and parsing the data from Google Sheets in a way that means this could much more easily be changed in the future - the business-logic services have no context of the (sometimes challenging!) format the data is read in from Google Sheets, only the business models provided to them.

Given that the repository is public, there are no public API keys or secrets in the codebase - they are all read from environmental variables stored directly against the Lambdas that I have inputted manually (as opposed to entering them via the `serverless.yml`, since that is also stored in the codebase).
The base AWS URL for invoking the above endpoints is: `https://b57n0rlzdj.execute-api.eu-west-1.amazonaws.com`.

### Commands
The API can be used locally using the following commands:
`npm start` runs the application locally at `http://localhost:3000` (this URL is also included in the Postman collection under the `local_url` variable).
`npm run build` will build the application by transpiling the TypeScript code into JavaScript and storing the results in the `dist` folder.
`npm run lint` will run linting rules against the codebase.
`npm run test` will run all unit tests.

### Architecture
This is a basic run-through of the flow of data through the API, from the endpoint, to Google Sheets, and back to the user. For this example, I'll be using the most complex of all the endpoints - `/songs`.
1. The endpoint `/songs`is exposed via AWS API Gateway, and allows access through to the endpoint on the Lambda.
2. The request is compared against validation rules defined against the endpoint. For this endpoint, the query strings are checked to make sure they are of the correct data-types (for example `?year` must be an integer, and `?artists` must be a string). These query strings are sanitised and converted as part of the validation process into the data-types they are expected to be - so by the time the data hits the actual endpoint in `app.ts`, `year` has been converted to a number, and `artists`/`writers` has been converted to an array of strings. This means this data conversion functionality is abstracted away from the controller. The validators use the `validation.utility.ts` class file to implement any sanitisation.
3. On reaching the `/songs` endpoint, the `buildFilters` functions is invoked which builds a `SongFilter` object based on any query string parameters provided. Since these query strings have already been sanitised, this is essentially just manual mapping from query string to appropriate `SongFilter` property. This filter object is then passed directly to the `SongsService.getSongs` function.
4. As part of the `getSongs` functionality, the actual data must be first be retrieved from the Google Sheets API. The call to first get the rows of data from Google Sheets is implemented in the `GoogleSheetsClient`, which acts as a gateway to the Google Sheets API to which to make requests. After that point, all of the parsing of the row data is abstracted away from this service level into the `parser` file directory, which essentially acts as a repository to convert the data into more useful objects. To achieve this, the `SongService` can call `parserService.parseRowsToObject(rows, Song);`, with this second parameter being a generic type `T` to which to attempt to convert the `rows`. `Song` has been established as a valid conversion type in the `GoogleSheetsParserService`, so the conversion will take place through the `SongBuilder.initialise()`, which is responsible for converting each individual row into a `Song` object. The objects are placed in an array, and returned to the `GoogleSheetsService`. I implemented this abstraction specifically to facilitate any future migration from Google Sheets API to a DB, so that we could handle all DB functionality in here, with the service levels remaining unaffected.
5. After retrieving and parsing the data, the `getSongs` function will apply any predicates (in this example, just the filter, but in other endpoints, there can be a `sort` and `limit` applied as well). All of these predicate parameters are optional, so if someone just wanted a list of all songs without any filters or sorting, that's exactly what they'll get! Each filter works slightly differently just based on the context of said filter:
    * `title` and `album` are direct string matches (case-insensitive)
    * `artists` and `writers` are also string matches, but are case-sensitive due to the complexities of comparing arrays
    * `year`, `startYear`, `endYear`, `minTotalPlays`, and `maxTotalPlays` are all numeric:
        * `year` is a direct number match
        * `startYear` and `minTotalPlays` return results that have greater than or equal matches
        * `endYear` and `maxTotalPlays` return results that have less than or equal matches
6. These filtered (and, if applicable, sorted) results are returned to the user in `Array<Song>` format.

The `/summary` endpoints instead return an array of strings in the format `{song name} - {artist1}, {artist2} ({year})`.
The `/songs/top` endpoints return the full song list but sorted by plays. The base endpoint `/songs/top` sorts the list by total plays across all monthly data; the `/songs/top/month/june,july`, as an example, returns all songs sorted by the total plays across June and July, in descending order.


## Desired Improvements
1. More flexible string-matching in filtering songs - for example, a partial substring check. If providing `artist=Taylor Swift` in the filter, be flexible enough to find songs that have `featuring Taylor Swift` in their artists list, rather than a direct string check.
2. Related to above, the `artists` and `writers` filters are case-sensitive. Given more time I would have liked to make these case-insensitive.
3. More generally speaking - more error handling! I implemented controller-level general catches which logs the entire error stack, and returns the error message. 