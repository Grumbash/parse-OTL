const puppeteer = require('puppeteer');
const { setTextInputValue } = require("./shared/setInputTextValue");
const getDataFromPage = require("./controllers/getDataFromPage");


async function parsing({ URL, USER_NAME, USER_PASSWORD }, weekNo) {
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

    // Get week from DB
    // Data processing 
    const periods = [];
    // Why I use weeks? It must be something else 
    for (let week = 1; week <= weekNo; week++) {
      periods.push(await getDataFromPage(week, page));
    }

    browser.close();

    return periods;

  } catch (error) {
    console.error(error);
  }
}

module.exports = parsing;