// const express = require('express');
const express = require('express');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'BYOB';
app.use(express.json());

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


app.post('/api/v1/licenses', (request, response) => {
  const license = request.body;

  for (let requiredParameter of ['licensee_name', 'doing_business_as', 'license_type', 'issue_date', 'license_number', 'street_address', 'city', 'state', 'zip']) {
    if (!license[requiredParameter]) {
      return response
        .status(422)
        .send({error:`Expected format: { licensee_name: <String>, doing_business_as: <String>, license_type: <String>, issue_date: <String>, license_number: <String>, street_address: <String>, city: <String>, state: <String>, zip: <String>}. You are missing a "${requiredParameter}" property.`})
    }
  }

  database('licenses').insert(license, 'id')
    .then(license => {
      response.status(201).json({ id: license[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/checks', (request, response) => {
  const check = request.body;

  for (let requiredParameter of ['date', 'pass', 'agency']) {
    if (!check[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { date: <String>, pass: <Boolean>, agency: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('checks').insert(check, 'id')
    .then(check => {
      response.status(201).json({ id: check[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/checks/:id', (request, response) => {
  database('checks').where('id', request.params.id).del()
    .then((check) => response.status(201).json( `Compliance check with ID ${request.params.id} has been deleted`))
    .catch(error => response.status(500).json({error}))
})

app.delete('/api/v1/licenses/:id', (request, response) => {
  const deletePromises = [database('checks').where('license_id', request.params.id).del(), database('licenses').where('id', request.params.id).del()]
  Promise.all(deletePromises)
   .then((check) => response.status(201).json( `Liquor License and all associated compliance checks with Primary License ID ${request.params.id} has been deleted`))
   .catch(error => response.status(500).json({error}))
})

