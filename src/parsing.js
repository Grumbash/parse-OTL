const puppeteer = require('puppeteer');

const { setTextInputValue } = require("./shared/setInputTextValue")
const getOTL_data = require("./controllers/getOTL_data");
const getDB_data = require("./controllers/getDB_data");
const compareData = require("./controllers/compareData");
const getDataFromExpandTable = require("./controllers/getDataFromExpandTable");


async function parsing({ URL, USER_NAME, USER_PASSWORD }) {
  try {
    const browser = await puppeteer.launch({
      headless: false, defaultViewport: {
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

    const checkForDataUpdate = async (weekNo) => {
      try {
        const DB_data = await getDB_data()
        const OTL_data = await getOTL_data(page)

        // Compare status and week range
        const isSame = compareData(DB_data, OTL_data);
        if (!!isSame) {
          return await { response: "Data are same" }
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
        return await getDataFromExpandTable({ page, selector: ExpandTableSelector });

      } catch (error) {
        console.error(error);
      }
    };

    let weekNo = 1;
    // Data processing 
    return await checkForDataUpdate(weekNo);

  } catch (error) {
    console.error(error);
  }
}

module.exports = parsing;