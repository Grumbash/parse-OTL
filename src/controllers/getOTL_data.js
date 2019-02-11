module.exports = async (page) => {
  await page.waitForSelector("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody");

  const lastDate = await page.evaluate(() => {
    // Get first row data
    const firtsRow = 0;
    const period = document.querySelectorAll("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr > td:nth-child(1)")[firtsRow].textContent;
    const status = document.querySelectorAll("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr > td:nth-child(3)")[firtsRow].textContent;
    return {
      period,
      status
    }
  })
  return lastDate;
}