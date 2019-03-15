require('dotenv/config');

const CronJob = require('cron').CronJob;
const startParsing = require("./asyncWeeksCycle");
const mongoose = require("mongoose");
const CredModel = require("./src/models/Cred");
const finishOutput = require("./src/shared/consoleOutput")
const cmd = require("./src/shared/cmdPromise");
const logger = require("./logger");

const { URL } = process.env;

mongoose.Promise = Promise;
mongoose
  .connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true
    }
  )
  .then(
    () => logger.info({ message: "MongoDB Connected" })
  )
  .catch(
    err => logger.error(err)
  );

const randomSec = "00",
  randomMin = "*/5",
  randonHour = "*",
  daysOfWeek = "*"
const job = new CronJob(`${randomSec} ${randomMin} ${randonHour} * * ${daysOfWeek}`, async () => {

});

// Dev mod
(async () => {
  const users = await CredModel.find({});

  await cmd(process.env.CMD_COMMAND_START);
  for (const user of users) {
    try {
      await startParsing({ USER_NAME: user.sso.login, USER_PASSWORD: user.sso.password }, URL);
    } catch (error) {

      logger.error(error);
    }

  }
  await cmd(process.env.CMD_COMMAND_STOP);
  logger.info({ message: finishOutput })
})();



job.start();
