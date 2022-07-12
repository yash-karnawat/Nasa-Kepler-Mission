const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunch,
} = require('../../models/launches.model');

const { getPagination } = require('../../services/query');

const httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);

  res.status(200).json(launches);
};

const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.launchDate ||
    !launch.rocket ||
    !launch.target
  ) {
    return res.status(400).json({
      error: 'Invalid input property',
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (launch.launchDate.toString() === 'Invalid Date') {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }

  await addNewLaunch(launch);

  return res.status(201).json(launch);
};

const httpAbortLaunch = async (req, res) => {
  const { id } = req.params;

  if (!(await existsLaunchWithId(Number(id)))) {
    return res.status(404).json({
      error: 'Launch id not found',
    });
  } else {
    const isDeleted = await abortLaunch(Number(id));
    return res.status(200).json({
      ok: isDeleted,
    });
  }
};

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
