[![Build Status](https://travis-ci.org/killzoner/nest-game.svg?branch=master)](https://travis-ci.org/killzoner/nest-game) 

## Description

NestJS test project

## Installation

```bash
$ npm install -g yarn
$ yarn install --frozen-lockfile
```

## Running the app (docker)

Make sure node dependencies are installed with previous steps
and then run 
```bash
$ docker-compose -f docker-compose-test.yml up
```

Head to localhost:4000 or localhost:4000/api for swagger API

#### Note
In real life we would not have DB on docker without at least a mounted volume,
or even having the service managed via another machine

## Running the app (node)

```bash
# development
$ npm run start # head to localhost:3000
```

## Test

```bash
# unit tests
$ npm run test
```

## Possible enhancements

The make would clearly need some tests but i don't really have time for more things in the test.
Also, the image for the node app would need proper management via some tool like pm2 or equivalent,
and definition a healthcheck for external supervision of the container
