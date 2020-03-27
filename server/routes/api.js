const express = require('express');
const knex = require('../lib/knex.js');

const worldMap = require('../geodata/worldMapCountries.json');
const countryStats = require('../geodata/pollution.json');

const router = express.Router();

router.get('/getWorld', async (req, res) => {
  res.json(worldMap);
});

router.get('/getCountry', async (req, res) => {
  const { country } = req.body;
  const json = require(`../geodata/countries/${country}.json`);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(json);
});

router.get('/countryStats', async (req, res) => {
  res.send(countryStats);
});

module.exports = router;
