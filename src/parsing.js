require('dotenv/config');

const puppeteer = require('puppeteer');
const { setTextInputValue } = require("./shared/setInputTextValue");
const moment = require("moment");
const asyncProcessArray = require("./controllers/asyncProcessArray");
const logger = require("../logger");

async function parsing({ URL, USER_NAME, USER_PASSWORD }, userId) {
  const browser = await puppeteer.launch({
    headless: true, defaultViewport: {
      width: 1920,
      height: 1080
    }, args: ['--window-size=1920,1080']
  });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(90000);
    await page.goto(URL, {
      waitUntil: ['networkidle0', "domcontentloaded"]
    });
    await page.waitForSelector("input#sso_username", { visible: true });
    await setTextInputValue(page, `input#sso_username`, USER_NAME);
    await setTextInputValue(page, `input#ssopassword`, USER_PASSWORD);
    await page.click("a[href='javascript:doLogin(document.LoginForm);']");
    await page.waitForSelector(".flat-grid-cell>.app-nav-item svg[data-icon='navi_ledgerclock']", { visible: true });
    await page.click(".flat-grid-cell>.app-nav-item svg[data-icon='navi_ledgerclock']");

    // Code below for picking data in particular period 

    const firstDayOfMonth = moment(new Date).startOf('month').format("MM/DD/YY");
    const lastDayOfMonth = moment(new Date).endOf('month').format("MM/DD/YY");
    await page.waitForSelector("tr[style] > td:nth-child(3) > button", { visible: true });
    await page.evaluate((({ firstDayOfMonth, lastDayOfMonth }) => {
      const fromInput = document.querySelectorAll("input[id]")[3];
      const toInput = document.querySelectorAll("input[id]")[5];
      const searchButton = document.querySelectorAll("td[class] > button[id]")[6];


      fromInput.value = firstDayOfMonth;
      toInput.value = lastDayOfMonth;
      searchButton.click()

    }), ({ firstDayOfMonth, lastDayOfMonth }));

    await page.waitForSelector("table[summary='Search Results:Time Cards'] > tbody > tr", { visible: true });
    await page.waitFor(5000);

    const weeks = await page.evaluate(() => [...document.querySelectorAll("table[summary='Search Results:Time Cards'] > tbody > tr")]);
    let periods = [];
    if (weeks.length) {
      periods = await asyncProcessArray(page, weeks, userId);
    }

    browser.close();
    return periods;

  } catch (error) {
    browser.close();
    logger.error(error);
    return [];
  }
}

module.exports = parsing;