const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'worldmap',
    password: 'worldmap',
    database: 'worldmap',
  },
});

module.exports = knex;
