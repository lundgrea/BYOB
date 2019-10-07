# BYOB
Build Your Own Backend

### Access The Active API:

API Base URL:<br>
[Build Your Own Backend](https://ajl-byob.herokuapp.com)<br>

Overview: 
This project is an introduction to backend development. The one-to-many PostgresSQL database schema was migrated and seeded using Knex, alongside an Express server with fetch calls to the Node.js API endpoints.

---

### Table Of Contents
- [Database and Schema](#database-and-schema)
- [Basic Repo Info](#basic-repo-info)
- [Setup](#setup)
- [API End Points](#api-end-points)
- [Basic Repo Info](#basic-repo-info)
- [Authors](#authors)

---

### Database and Schema
![screenshot](https://user-images.githubusercontent.com/38546045/66278741-9f32eb00-e89b-11e9-9771-cb5c0d3a7a60.png)
The database is a PostgreSQL database, made up of two tables.
<br>

The first is Colorado liquor licenses, which is seeded with:
 - Licensee Name
 - Doing Business As
 - License Type
 - Issue Date
 - License Number
 - Street Address
 - City
 - State
 - Zip
<br>

The second displays complaince checks, which each contain:
 - Date
 - Pass Status
 - Agency 

<br>

---

## Basic Repo Info:

### Versions/Prerequisites

##### Tech Stack:
To Install and run this application please be aware of the following versions and requirements:
- PostgreSQL 10+
- Express
- JavaScript

### Setup

#### Clone this repository:

  ```
  git clone https://github.com/lundgrea/BYOB.git
  ```
  ```
  cd BYOB
  ```

#### Updgrade pip and install dependencies

  ```shell
  npm install
  ```

#### Set up databases using PostgreSQL

  ```shell
  CREATE DATABASE byob;
  \c byob
  ```

#### Migrate/Seed

  ```shell
  knex migrate:latest
  knex seed:run
  knex migrate:latest --env test
  knex seed:run --env test
  ```

## Run the Server

To see your code in action locally, you need to fire up a development server. Use the command:

```shell
npm start
```

Once the server is running, visit API endpoints in your browser:

* `http://localhost:3000/` to run your application.

<br>

---

### API End Points
This is a restful API.

---

## Licenses

##### GET REQUESTS
<br>
To get all licenses:

```
GET /api/v1/licenses
```

The licenses will be returned in as JSON to look like:

```
[
    {
        "id": 161,
        "licensee_name": "RAG N BONES",
        "doing_business_as": "RAG N BONES",
        "license_type": "BREWPUB",
        "issue_date": "2019-10-10",
        "license_number": "03-12289",
        "street_address": "2695 MAIN STREET",
        "city": "Boulder",
        "state": "CO",
        "zip": "80305",
        "created_at": "2019-10-03T19:49:15.097Z",
        "updated_at": "2019-10-03T19:49:15.097Z"
    },
    {
        "id": 131,
        "licensee_name": "BREWER'S STAR DISTRIBUTORS LLC",
        "doing_business_as": "BREWER'S STAR DISTRIBUTORS LLC",
        "license_type": "Wholesale (vinous & spirituous)",
        "issue_date": null,
        "license_number": "03-11954",
        "street_address": "3550 FRONTIER AVE SUITE A-3",
        "city": "Boulder",
        "state": "CO",
        "zip": "80301",
        "created_at": "2019-10-03T15:38:40.612Z",
        "updated_at": "2019-10-03T15:38:40.612Z"
    },
...
]
```

<br>

To get a single license:

```
GET /api/v1/license/:license_id
```

Example:

```
GET /api/v1/license/131
```

will return a response body of:

```
[
    {
        "id": 131,
        "licensee_name": "BREWER'S STAR DISTRIBUTORS LLC",
        "doing_business_as": "BREWER'S STAR DISTRIBUTORS LLC",
        "license_type": "Wholesale (vinous & spirituous)",
        "issue_date": null,
        "license_number": "03-11954",
        "street_address": "3550 FRONTIER AVE SUITE A-3",
        "city": "Boulder",
        "state": "CO",
        "zip": "80301",
        "created_at": "2019-10-03T15:38:40.612Z",
        "updated_at": "2019-10-03T15:38:40.612Z"
    }
]
```

<br>


##### POST REQUESTS
<br>
To create a liquor license item send:

```
POST /api/v1/license, params: 
{
"licensee_name": "RAG N BONES",
"doing_business_as": "RAG N BONES",
"license_type": "BREWPUB",
"issue_date": "2019-10-10",
"license_number": "03-12289",
"street_address": "2695 MAIN STREET",
"city": "Boulder",
"state": "CO",
"zip": "80305"
}
```

This will return the new liquor license's primary key in the database.

Sample Response:
```
{
"id": 161
}
```

<br>


##### DELETE REQUESTS

<br>
To delete a liquor license:

```
DELETE /api/licenses/:license_id
```

It will return a message as JSON about the success of the deletion.


## Compliance Checks
Checks has traditional RESTFUL routes for its index and single compliance check.

##### GET REQUESTS
<br>
To request all compliance checks for all liquor licenses:

```
GET /api/v1/checks
```

The checks will be returned in as JSON to look like:

```
[
    {
        "id": 1,
        "date": "2019-09-15",
        "pass": true,
        "agency": "CLED",
        "license_id": 131,
        "created_at": "2019-10-03T15:38:40.640Z",
        "updated_at": "2019-10-03T15:38:40.640Z"
    },
    {
        "id": 2,
        "date": "2019-10-22",
        "pass": true,
        "agency": "BPD",
        "license_id": 131,
        "created_at": "2019-10-03T15:38:40.641Z",
        "updated_at": "2019-10-03T15:38:40.641Z"
    }
]
```

<br>
To receive one of the available compliance checks access:

```
GET /api/v1/checks/:check_id
```

##### POST REQUESTS
<br>
To create a new compliance check item send:

```
POST /api/v1/checks, params: 
{
"date": "2019-10-10",
"pass": "false",
"agency": "DPD",
"license_id": "161"
}


```

This will return the new compliance check's primary key in the database.

Successful sample Response: 

```
{
"id": 55
}
```

<br>

##### DELETE Requests

To remove the a compliance check:

```
DELETE /api/v1/checks/:check_id
```

It will return a JSON success response.

<br>

---

### Authors
- [Alyssa Lundgren](https://github.com/lundgrea)
