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

// const axios = require('axios');
// const _ = require('lodash');
// const fs = require('fs');
// const countries = require('./geodata/worldMapCountries.json');

// (async () => {
//   try {
//     const promises = _.map(countries.features, (c) => {
//       const response = axios.get(`http://codegod.xyz:8090/statsCountry?country=${c.id}`);
//       return response;
//     });
//     const from = Date.now();
//     const aqifeed = await Promise.all(promises);
//     const tosave = [];
//     const to = Date.now();
//     _.forEach(aqifeed, (aqi, id) => {
//       tosave.push({
//         country: countries.features[id].id,
//         data: aqi.data,
//       });
//     });
//     fs.writeFile('./server/geodata/pollution.json', JSON.stringify(tosave), (err) => {
//       if (err) throw err;
//       console.log('The file has been saved!');
//     });
//     console.log(`Time taken to get the countries: ${(to - from) / 1000} seconds`);
//   } catch (e) {
//     console.log(e);
//   }
// })();

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on port: ${port}`);
