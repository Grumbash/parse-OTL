const logger = require("../../logger");

module.exports = async (page, firtsRow = 0) => {
  logger.info({ message: `Getting OTL data of periods` });
  try {
    await page.waitForSelector("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody");
    logger.info({ message: `Evaluate and return data of periods` });
    return await page.evaluate((firtsRow) => {
      // Get first row data
      const period = document.querySelectorAll("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr > td:nth-child(1)")[firtsRow].textContent;
      const [from, to] = period.split(" - ");
      const status = document.querySelectorAll("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr > td:nth-child(3)")[firtsRow].textContent;
      return {
        from,
        to,
        status
      }
    }, firtsRow);

  } catch (error) {
    logger.error(error);
    return {
      from: "failed to connect",
      to: "failed to connect",
      status: "failed to connect"
    }
  }

}