const getOTL_data = require("../controllers/getOTL_data");
const getDataFromExpandTable = require("../controllers/getDataFromExpandTable");

module.exports = async (page, indx) => {
  try {
    const periodNo = indx + 1;
    const fullInfoSelector = `table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr:nth-child(${(periodNo)}) > td:nth-child(10) > span > a`;
    await page.waitForSelector(fullInfoSelector, { visible: true });

    const OTL_data = await getOTL_data(page, indx);

    // Go to full info table
    await page.evaluate((selector) => {
      const toClick = document.querySelector(selector);
      toClick.click();
    }, fullInfoSelector);
    console.log("Went to full info table");

    // Get data for the week
    const ExpandTableSelector = "table[summary='Time Card Entries'] tr.xeq > td:nth-child(2) tr";
    const projects = await getDataFromExpandTable({ page, selector: ExpandTableSelector });
    console.log("Got data for the week");

    // Go back to main table
    await page.evaluate(() => {
      const closeTabSelector = document.querySelectorAll("div[class] > a[onClick][id][class][href]")[2];
      closeTabSelector.click();
    });
    console.log("Went back to main table");

    const result = { ...OTL_data, projects };
    return result;
  } catch (error) {
    console.log(error);
  }
}