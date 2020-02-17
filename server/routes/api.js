const express = require('express');
const knex = require('../lib/knex.js');

const worldMap = require('../geodata/worldMapCountries.json');

const router = express.Router();

router.post('/getWorld', async (req, res) => {
  res.json(worldMap);
});

router.post('/getCountry', async (req, res) => {
  const { country } = req.body;
  const json = require(`../geodata/countries/${country}.json`);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(json);
});

module.exports = router;
