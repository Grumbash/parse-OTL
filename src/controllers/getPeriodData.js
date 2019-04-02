const getOTL_data = require("./getOTL_data");
const getDataFromExpandTable = require("./getDataFromExpandTable");
const PeriodModel = require("../models/Period");
const logger = require("../../logger");

module.exports = async (page, weekNo, userId, USER_NAME) => {
  try {
    const periodNo = weekNo + 1;
    const fullInfoSelector = `table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr:nth-child(${(periodNo)}) > td:nth-child(10) > span > a`;
    await page.waitForSelector(fullInfoSelector, { visible: true, timeout: 30000 });

    const OTL_data = await getOTL_data(page, weekNo);
    const dbPeriod = await PeriodModel.findOne({ user: userId, from: OTL_data.from });

    let newPeriod = null;

    if (!!dbPeriod) {
      newPeriod = dbPeriod;
      logger.info({ message: `Use existing period data` });
    } else {
      newPeriod = await new PeriodModel({ ...OTL_data, user: userId }).save();
      logger.info({ message: `Creating new period in DB and use it` });
    }

    // Go to full info table
    logger.info({ message: `Go to full info table` });
    await page.evaluate((selector) => {
      const toClick = document.querySelector(selector);
      toClick.click();
    }, fullInfoSelector);


    // Get data for the week
    logger.info({ message: `Get data for the week` });
    const ExpandTableSelector = "table[summary='Time Card Entries'] tr.xeq > td:nth-child(2) tr";
    const [projectsIds, screenshot] = await getDataFromExpandTable({ page, selector: ExpandTableSelector }, newPeriod.id, USER_NAME);

    // Go back to main table
    logger.info({ message: `Go back to main table` });
    await page.evaluate(() => {
      const closeTabSelector = document.querySelectorAll("div[class] > a[onClick][id][class][href]")[2];
      closeTabSelector.click();
    });

    const period = { ...OTL_data, projects: projectsIds, userId, screenshot };

    const { id } = await PeriodModel.findByIdAndUpdate(newPeriod.id, period);
    logger.info({ message: `Return id: ${id} of period` });

    return id;
  } catch (error) {
    console.log(error);
    logger.error(error);
    return '';
  }
}