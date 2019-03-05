const getOTL_data = require("./getOTL_data");
const getDataFromExpandTable = require("./getDataFromExpandTable");
const PeriodModel = require("../models/Period");

module.exports = async (page, weekNo, userId) => {
  try {
    const periodNo = weekNo + 1;
    const fullInfoSelector = `table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr:nth-child(${(periodNo)}) > td:nth-child(10) > span > a`;
    await page.waitForSelector(fullInfoSelector, { visible: true, timeout: 10000 });

    const OTL_data = await getOTL_data(page, weekNo);
    const dbPeriod = await PeriodModel.findOne({ user: userId, from: OTL_data.from });

    let newPeriod = null;

    if (!!dbPeriod) {
      newPeriod = dbPeriod;
    } else {
      newPeriod = await new PeriodModel({ ...OTL_data, user: userId }).save();
    }

    // Go to full info table
    await page.evaluate((selector) => {
      const toClick = document.querySelector(selector);
      toClick.click();
    }, fullInfoSelector);

    // Get data for the week
    const ExpandTableSelector = "table[summary='Time Card Entries'] tr.xeq > td:nth-child(2) tr";
    const projectsIds = await getDataFromExpandTable({ page, selector: ExpandTableSelector }, newPeriod.id);

    // Go back to main table
    await page.evaluate(() => {
      const closeTabSelector = document.querySelectorAll("div[class] > a[onClick][id][class][href]")[2];
      closeTabSelector.click();
    });

    const period = { ...OTL_data, projects: projectsIds, userId };

    const { id } = await PeriodModel.findByIdAndUpdate(newPeriod.id, period)
    return id;
  } catch (error) {
    console.log(error);
    return '';
  }
}