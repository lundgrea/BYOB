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

app.get('/api/v1/licenses/:id', (request, response) => {
  database('licenses').where('id', request.params.id).select()
    .then(licenses => {
      if (licenses.length) {
        response.status(200).json(licenses);
      } else {
        response.status(404).json({ 
          error: `Could not find license with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/checks/:id', (request, response) => {
  database('checks').where('id', request.params.id).select()
    .then(checks => {
      if (checks.length) {
        response.status(200).json(checks);
      } else {
        response.status(404).json({ 
          error: `Could not find a compliance check with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});