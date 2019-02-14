const puppeteer = require('puppeteer');
const { setTextInputValue } = require("./shared/setInputTextValue");
const getDataFromPage = require("./controllers/getDataFromPage");
const getOTL_data = require("./controllers/getOTL_data");
const getDataFromExpandTable = require("./controllers/getDataFromExpandTable");
const moment = require("moment");

async function parsing({ URL, USER_NAME, USER_PASSWORD }) {
  try {
    const browser = await puppeteer.launch({
      headless: true, defaultViewport: {
        width: 1920,
        height: 1080
      }, args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(90000);
    await page.goto(URL, {
      waitUntil: ['networkidle0', "domcontentloaded"]
    });

    await setTextInputValue(page, `input#sso_username`, USER_NAME);
    await setTextInputValue(page, `input#ssopassword`, USER_PASSWORD);
    await page.click("a[href='javascript:doLogin(document.LoginForm);']");
    await page.waitForSelector(".flat-grid-cell>.app-nav-item svg[data-icon='navi_ledgerclock']", { visible: true });
    await page.click(".flat-grid-cell>.app-nav-item svg[data-icon='navi_ledgerclock']");

    await page.evaluate(() => {
      const fromInput = document.querySelectorAll("input[id]")[3];
      const toInput = document.querySelectorAll("input[id]")[6];
      const searchButton = document.querySelectorAll("td[class] > button[id]")[6];
      const firstDAyOfMonth = moment(new Date).startOf('month').format("MM/DD/YY");
      const lastDayOfMonth = moment(new Date).endOf('month').format("MM/DD/YY");

      fromInput.value = firstDAyOfMonth;
      toInput.value = lastDayOfMonth;
      searchButton.click()
    });

    await page.waitForSelector("table[summary='Search Results:Time Cards'] > tbody > tr", { visible: true });

    const weeks = await page.evaluate(() => [...document.querySelectorAll("table[summary='Search Results:Time Cards'] > tbody > tr")]);

    weeks.forEach(async (elem, indx) => {
      const OTL_data = await getOTL_data(page, indx);
      let fullInfoSelector = `table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr:nth-child(${weekNo}) > td:nth-child(10) > span > a`;
      await page.waitForSelector(fullInfoSelector, { visible: true });
      await page.evaluate((selector) => {
        let toClick = document.querySelector(selector);
        toClick.click();
      }, fullInfoSelector);

      // Get data for the week
      let ExpandTableSelector = "table[summary='Time Card Entries'] tr.xeq > td:nth-child(2) tr";
      const projects = await getDataFromExpandTable({ page, selector: ExpandTableSelector });
      await goBack()
      return { ...OTL_data, projects };
    });


    browser.close();

    return periods;

  } catch (error) {
    console.error(error);
  }
}

module.exports = parsing;