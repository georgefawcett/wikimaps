# wikiMaps

## About

An application for users to create, share, and edit lists of locations, using the Google Maps API.

## Setup

The database and application are being hosted on Heroku - the website is accessible at https://shrouded-shelf-81582.herokuapp.com/.  As such, and given the amount of time spent setting up the Heroku database, there are no migration/seed data files in the repository.

## Features

### User registration and login

### User dashboards


1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
