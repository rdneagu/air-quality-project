const express = require('express');
const bodyParser = require('body-parser');
const api = require('./routes/api');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', api);

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on port: ${port}`);
