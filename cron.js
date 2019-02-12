const CronJob = require('cron').CronJob;

console.log('Before job instantiation');
const job = new CronJob('00 30 1 * * 1,4', function () {
  const d = new Date();
  console.log('onTick:', d);
});
console.log('After job instantiation');
job.start();