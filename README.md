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

## Technical Information
This API is hosted in AWS Lambda functions, built and deployed using [Serverless](https://www.serverless.com/). The deployment infrastructure-as-code can be viewed in the `serverless.yml` file. The deployment is invoked via [GitHub Actions](https://github.com/peteraiken/swiftcloud/actions), which installs packages, builds the app, runs linting and unit tests, before finally deploying via Serverless to AWS.
The Lambda functions are abstracted behind an API Gateway, capable of restricting requests to specific paths and methods. I have not implemented restrictions in this way, given the non-sensitive nature of the information at this time. All logging is stored and persisted in AWS CloudWatch.

The core data is being read via the [Google Sheets API](https://developers.google.com/sheets/api), authenticated under my personal API key, although I would have liked to create a service account to handle this instead. Ideally, I would have liked to migrate this data to DynamoDB and read the data directly from there, but decided not to when considering the time it may take to implement this. Nonetheless, I abstracted the process of reading and parsing the data from Google Sheets in a way that means this could much more easily be changed in the future - the business-logic services have no context of the (sometimes challenging!) format the data is read in from Google Sheets, only the business models provided to them.

Given that the repository is public, there are no public API keys or secrets in the codebase - they are all read from environmental variables stored directly against the Lambdas that I have inputted manually (as opposed to entering them via the `serverless.yml`, since that is also stored in the codebase).
The base AWS URL for invoking the above endpoints is: `https://b57n0rlzdj.execute-api.eu-west-1.amazonaws.com`.

### Commands
The API can be used locally using the following commands:
`npm start` runs the application locally at `http://localhost:3000` (this URL is also included in the Postman collection under the `local_url` variable).
`npm run build` will build the application by translating the TypeScript code into JavaScript and storing the results in the `dist` folder.
`npm run lint` will run linting rules against the codebase.
`npm run test` will run all unit tests.