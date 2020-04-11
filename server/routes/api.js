const express = require('express');

const worldMap = require('../geodata/worldMapCountries.json');

const router = express.Router();

router.get('/getWorld', async (req, res) => {
  res.json(worldMap);
});

router.get('/getCountry', async (req, res) => {
  const { country } = req.query;
  const json = require(`../geodata/countries/${country}.json`); // eslint-disable-line
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.send(json);
});

module.exports = router;
