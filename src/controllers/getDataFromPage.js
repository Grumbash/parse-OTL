const getOTL_data = require("./getOTL_data");
const getDB_data = require("./getDB_data");
const compareData = require("./compareData");
const getDataFromExpandTable = require("./getDataFromExpandTable");

module.exports = async (weekNo, page) => {
  try {
    const DB_data = await getDB_data(weekNo)
    const OTL_data = await getOTL_data(page, weekNo);

    // Compare status and week range
    const isSame = compareData(DB_data, OTL_data);
    if (!!isSame) {
      return await DB_data;
    }

    // Click to open full data for a week

    let fullInfoSelector = `table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr:nth-child(${weekNo}) > td:nth-child(10) > span > a`;
    await page.waitForSelector(fullInfoSelector, { visible: true });
    await page.evaluate((selector) => {
      let toClick = document.querySelector(selector);
      toClick.click();
    }, fullInfoSelector);

    // Obtain data for the week
    let ExpandTableSelector = "table[summary='Time Card Entries'] tr.xeq > td:nth-child(2) tr";
    const projects = await getDataFromExpandTable({ page, selector: ExpandTableSelector });

    return { ...OTL_data, projects };

  } catch (error) {
    console.error(error);
  }
};