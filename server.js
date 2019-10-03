// const express = require('express');
import express from 'express';
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'BYOB';

app.get('/', (request, response) => {
  response.send('Oh hey there, BYOB');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

app.get('/api/v1/licenses', (request, response) => {
  database('licenses').select()
    .then((licenses) => {
      response.status(200).json(licenses);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/checks', (request, response) => {
  database('checks').select()
    .then((checks) => {
      response.status(200).json(checks);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});