const getPeriodData = require("./getPeriodData");

module.exports = async (page, weeks, userId) => {
  const result = [];
  for (let weekNo = 0; weekNo < weeks.length; weekNo++) {
    result.push(await getPeriodData(page, weekNo, userId))
  }
  return result;
}