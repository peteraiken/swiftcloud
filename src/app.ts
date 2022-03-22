import express, { RequestHandler } from 'express';
const app = express();
const port = 3000;

app.get('/', (request, response) => {
    response.send('Hello world!');
});

app.listen(port, () => {
    return console.log(`App is running at http://localhost:${port}`);
});