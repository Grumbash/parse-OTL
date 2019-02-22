require('dotenv/config');

const CronJob = require('cron').CronJob;
const startParsing = require("./asyncWeeksCycle");
const mongoose = require("mongoose");
const CredModel = require("./src/models/Cred");

const { URL } = process.env;
const users = [
  {
    USER_NAME: process.env.USER_NAME,
    USER_PASSWORD: process.env.USER_PASSWORD
  }, {
    USER_NAME: process.env.USER_NAME_2,
    USER_PASSWORD: process.env.USER_PASSWORD_2
  }
];


mongoose.Promise = Promise;
mongoose.set("debug", true);

mongoose
  .connect(
    process.env.DB_URL,
    {
      useNewUrlParser: true
    }
  )
  .then(
    () => console.log("MongoDB Connected")
  )
  .catch(
    err => console.log(err)
  );

const randomSec = "00",
  randomMin = "*/5",
  randonHour = "*",
  daysOfWeek = "*"
const job = new CronJob(`${randomSec} ${randomMin} ${randonHour} * * ${daysOfWeek}`, async () => {
  // const users = await CredModel.find({});
  // for (const user of users) {
  //   try {
  //     await startParsing({ USER_NAME: user.login, USER_PASSWORD: user.password }, URL);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
});

(async () => {
  const users = await CredModel.find({});
  for (const user of users) {
    try {
      await startParsing({ USER_NAME: user.login, USER_PASSWORD: user.password }, URL);
    } catch (error) {
      console.log(error);
    }
  }
})()



job.start();
