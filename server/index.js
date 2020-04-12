const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const api = require('./routes/api');

const worldMap = require('./geodata/worldMapCountries.json');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));
app.use(cors());

app.use('/api', api);

app.get('/map', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(worldMap);
});

app.get('/countryMap', (req, res) => {
  const { countryCode } = req.query;
  const json = require(`./geodata/countries/${countryCode}.json`); // eslint-disable-line
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(json);
});

app.get('/realTime', async (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const response = await axios.get(`https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=d3b80dc36410993d538776db2c79b3083ad14edf`);
    res.send(response.data);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on port: ${port}`);
