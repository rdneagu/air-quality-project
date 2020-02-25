const express = require('express');
const cors = require('cors');
const api = require('./routes/api');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use('/api', api);

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on port: ${port}`);
