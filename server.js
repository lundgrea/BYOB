//require express into our project
const express = require('express');
//set a variable app to an express server
const app = express();

//allows us to setup our enviroment, defaults to development
const environment = process.env.NODE_ENV || 'development';
//allows us to require our knex config file into our project
const configuration = require('./knexfile')[environment];
//allows us to use knex in our database configuration
const database = require('knex')(configuration);

//sets our port to access the 3000 port by default otherwise our production environment
app.set('port', process.env.PORT || 3000);
//sets the name of our app to BYOB
app.locals.title = 'BYOB';
//Allows our app to parse request body to json by default
app.use(express.json());


//express app GET request end point handler for our root route. Call back takes two parameters the request and the response
app.get('/', (request, response) => {
  //accessing the root end point sends a response of 'Oh hey there, BYOB'
  response.send('Oh hey there, BYOB');
});

//once the app is up and running access the port variable
app.listen(app.get('port'), () => {
  //send console log to the terminal displaying the port the app is running on
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

//express app GET request end point handler for our licenses database table, callback takes two parameters the request and the response
app.get('/api/v1/licenses', (request, response) => {
  //access the licenses database table and select this table (returns a promise object)
  database('licenses').select()
    //then with the licenses
    .then((licenses) => {
      //send a response with status of 200 and send all of the licenses in JSON
      response.status(200).json(licenses);
    })
    //if there is an error
    .catch((error) => {
      //send the error with a response code of 500 and the associated error in JSON
      response.status(500).json({ error });
    });
});

//express app GET request end point handler for our checks database table, callback takes two parameters the request and the response
app.get('/api/v1/checks', (request, response) => {
  //access the checks database and select this table (this returns an object)
  database('checks').select()
    //then with the checks
    .then((checks) => {
      //send a response with status code of 200 and send all the checks as JSON
      response.status(200).json(checks);
    })
    //if there is an error
    .catch((error) => {
      //send the error with a response code of 500 and the associated JSON'd error
      response.status(500).json({ error });
    });
});

//express app GET request end point handler for our licenses database table, call back takes two parameters the reqeust and the response
app.get('/api/v1/licenses/:id', (request, response) => {
  //access the licenses database where the ID in the primary key columnn matches the URL's input parameters
  database('licenses').where('id', request.params.id).select()
    //then with the license
    .then(licenses => {
      //if the licenses has length
      if (licenses.length) {
        //send a respons with status code 200 and JSON formatted license
        response.status(200).json(licenses);
      //otherwise if the licenses does not have a length (if there is not a license that matches)
      } else {
        //send a response with status code of 404
        response.status(404).json({ 
          //send an error that tells the user that the license with the provided ID is not available
          error: `Could not find license with id ${request.params.id}`
        });
      }
    })
    //if there is an error and the licenses are not available
    .catch(error => {
      //send a response with status code of 500 and send an error in JSON
      response.status(500).json({ error });
    });
});

//express app GET request end point handler for our checks database table, call back takes two parameters the reqeust and the response
app.get('/api/v1/checks/:id', (request, response) => {
  //access the checks database where the ID in the primary key columnn matches the URL's input parameters
  database('checks').where('id', request.params.id).select()
      //then with the check(s)
    .then(checks => {
      //if there are checks with this ID
      if (checks.length) {
       //send a respons with status code 200 and JSON formatted compliance checks
        response.status(200).json(checks);
      //otherwise
      } else {
        //send a response with status code of 404
        response.status(404).json({ 
          //send an error that tells the user that a compliance check with the provided ID is not available
          error: `Could not find a compliance check with id ${request.params.id}`
        });
      }
    })
    //if there is an error and the compliance checks are not available
    .catch(error => {
      //send a response with status code of 500 and send an error in JSON
      response.status(500).json({ error });
    });
});

//express app POST reqeust end point handler for our licenses database table, call back takes two parameters the request and the response
app.post('/api/v1/licenses', (request, response) => {
  //sets a variable license and assigns it to the body of the incoming request, capturing the input values
  const license = request.body;
  //assign a variable requiredParameters to an array of all of the required params
  for (let requiredParameter of ['licensee_name', 'doing_business_as', 'license_type', 'issue_date', 'license_number', 'street_address', 'city', 'state', 'zip']) {
    //if the input licenses does not include all of the required parameters
    if (!license[requiredParameter]) {
      //return a response
      return response
        //with a status code of 422
        .status(422)
        //and send an error letting the user know the param that was missing
        .send({error:`Expected format: { licensee_name: <String>, doing_business_as: <String>, license_type: <String>, issue_date: <String>, license_number: <String>, street_address: <String>, city: <String>, state: <String>, zip: <String>}. You are missing a "${requiredParameter}" property.`})
    }
  }
  //within the licenses database insert a new table row with the details from the request body and return the id, returns a promise
  database('licenses').insert(license, 'id')
    //then with the new license
    .then(license => {
      //update the status with response code of 201 and send a response of the newly created license id
      response.status(201).json({ id: license[0] })
    })
    //if there is an error with the promise 
    .catch(error => {
      //send a status response code of 500 with the error in JSON
      response.status(500).json({ error });
    });
});

//express app POST request end point handler for our checks database table, call back takes two parameters the request and the response
app.post('/api/v1/checks', (request, response) => {
//sets a variable check and assigns it to the body of the incoming request, capturing the input values
  const check = request.body;
  //assign a variable requiredParameters to an array of all of the required params
  for (let requiredParameter of ['date', 'pass', 'agency']) {
    //if the input compliance check does not include all of the required parameters
    if (!check[requiredParameter]) {
      //return a response
      return response
        //with a status code of 422
        .status(422)
        //and send an error letting the user know the param that was missing
        .send({ error: `Expected format: { date: <String>, pass: <Boolean>, agency: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  //within the checks database insert a new table row with the details from the request body and return the id, returns a promise
  database('checks').insert(check, 'id')
    //then with the new check
    .then(check => {
      //update the status with response code of 201 and send a response of the newly created compliance check id
      response.status(201).json({ id: check[0] })
    })
    //if there is an error with the promise 
    .catch(error => {
      //send a status response code of 500 with the error in JSON
      response.status(500).json({ error });
    });
});

//express app DELETE request end point handler for our checks database table, call back takes two parameters the request and the response
app.delete('/api/v1/checks/:id', (request, response) => {
  //in our checks database where the compliance check primary key matches the url's input param, delete the row
  database('checks').where('id', request.params.id).del()
    //then send a 201 response code letting the user know the compliance check has been deleted
    .then((check) => response.status(201).json( `Compliance check with ID ${request.params.id} has been deleted`))
    //if there is an issue send a response code status 500 with a json error
    .catch(error => response.status(500).json({error}))
})

//express app DELETE request end point handler for our licenses database table, call back takes two parameters the request and the response
app.delete('/api/v1/licenses/:id', (request, response) => {
  //sets a variable to the two necessary delete methods, the first item in the array deletes the check's whose foreign key matches the parameters, and the second item in the array deletes the liquor license whose primary key matches the input URL param
  const deletePromises = [database('checks').where('license_id', request.params.id).del(), database('licenses').where('id', request.params.id).del()]
  //ties the two promises together and awaits the return of both
  Promise.all(deletePromises)
    //if everything goes as planned the status code is updated to 201 and a message is sent letting the user know the licenses have been deleted as well as the associated compliance checks
   .then((check) => response.status(201).json( `Liquor License and all associated compliance checks with Primary License ID ${request.params.id} has been deleted`))
   //if there is an error send a response code of 500 as well as the error message
   .catch(error => response.status(500).json({error}))
})

