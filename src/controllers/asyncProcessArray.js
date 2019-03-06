const getPeriodData = require("./getPeriodData");
const logger = require("../../logger");

module.exports = async (page, weeks, userId) => {
  try {
    const result = [];
    for (let weekNo = 0; weekNo < weeks.length; weekNo++) {
      result.push(await getPeriodData(page, weekNo, userId));
    }
    return result;
  } catch (error) {
    logger.error(error);
  }
}