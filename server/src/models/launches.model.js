const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

const pupulateLaunches = async () => {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => payload['customers']);

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    await saveLaunch(launch);
  }
};

const loadLaunchesData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log('The launches collection is populated');
  } else {
    await pupulateLaunches();
  }
};

const saveLaunch = async (launch) => {
  await launches.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
};

const findLaunch = async (filter) => await launches.findOne(filter);

const existsLaunchWithId = async (launchId) =>
  await findLaunch({
    flightNumber: launchId,
  });

const getLatestFlightNumber = async () => {
  const latestFlightNumber = await launches.findOne().sort('-flightNumber');

  return latestFlightNumber
    ? latestFlightNumber.flightNumber
    : DEFAULT_FLIGHT_NUMBER;
};

const getAllLaunches = async (skip, limit) => {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .skip(skip)
    .limit(limit)
    .sort({
      flightNumber: 1,
    });
};

const addNewLaunch = async (launch) => {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error('No matching planet has been found');
  }

  const increasedLatestFlightNumber = (await getLatestFlightNumber()) + 1;

  await saveLaunch({
    ...launch,
    flightNumber: increasedLatestFlightNumber,
    customer: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
  });
};

const abortLaunch = async (launchId) => {
  const abortedLaunch = await launches.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );

  return abortedLaunch.modifiedCount === 1;
};

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  existsLaunchWithId,
};
