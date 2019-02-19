const getPeriodData = require("./getPeriodData");

module.exports = async (page, arr, userId) => {
  const result = [];
  for (let index = 0; index < arr.length; index++) {
    result.push(await getPeriodData(page, index, userId))
  }
  return result;
}