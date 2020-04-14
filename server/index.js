const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const _ = require('lodash');
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

app.post('/realTime', async (req, res) => {
  const { coords } = req.body;
  const promises = _.map(coords, (r) => {
    const response = axios.get(`https://api.waqi.info/feed/geo:${r.lat};${r.lon}/?token=d3b80dc36410993d538776db2c79b3083ad14edf`);
    return response;
  });
  try {
    const aqifeed = await Promise.all(promises);
    const data = _.map(aqifeed, (country, id) => {
      const mapping = { id: coords[id].id };
      if (country.data.status === 'ok') {
        return {
          ...mapping,
          aqi: country.data.data.aqi,
          iaqi: country.data.data.iaqi,
          dominent: country.data.data.dominentpol,
        };
      }
      return mapping;
    });
    res.json(data);
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
