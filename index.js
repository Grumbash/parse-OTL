require('dotenv/config');

const CronJob = require('cron').CronJob;
const startParsing = require("./asyncWeeksCycle");
const mongoose = require("mongoose");

const { URL } = process.env;
const users = [{
  USER_NAME: process.env.USER_NAME,
  USER_PASSWORD: process.env.USER_PASSWORD
}];


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
  randomMin = "*/3",
  randonHour = "*",
  daysOfWeek = "*"
const job = new CronJob(`${randomSec} ${randomMin} ${randonHour} * * ${daysOfWeek}`, async () => {
  console.log("Tick")
  for (const user of users) {
    try {
      await startParsing(user, URL);
    } catch (error) {
      console.log(error);
    }
  }
});

job.start();
