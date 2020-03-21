const express = require('express');
const path = require('path');
const cors = require('cors');
const api = require('./routes/api');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));
app.use(cors());

app.use('/api', api);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on port: ${port}`);
