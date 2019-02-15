const moment = require("moment");

module.exports = page => {
  const today = moment(new Date).format("MM/DD/YY");
  checkDataInDB();
  if (dataInDB && isApproved) {
    return DBdata;
  }

  filterByNowDate();
  getDataForCurrentMonth();

  return newData;
}