const express = require('express');

const planetsController = require('./planets.controller');

const planetsRouter = express.Router();

planetsRouter.get('/', planetsController.HttpGetAllPlanets);

module.exports = planetsRouter;
