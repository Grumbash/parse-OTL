module.exports = async (page, firtsRow = 0) => {
  try {
    await page.waitForSelector("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody");

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
    console.log(error);
    return {
      from: "failed to connect",
      to: "failed to connect",
      status: "failed to connect"
    }
  }

}