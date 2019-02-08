import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import 'dotenv/config';
import { setTextInputValue } from "./shared/setInputTextValue";
import getOTL_data from "./controllers/getOTL_data";
import getDB_data from "./controllers/getDB_data";
import compareData from "./controllers/compareData";




async function getData() {
  try {


    const browser = await puppeteer.launch({
      headless: false, defaultViewport: {
        width: 1920,
        height: 1080
      }, args: ['--window-size=1920,1080']
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);
    await page.goto(process.env.URL, {
      waitUntil: ['networkidle0', "domcontentloaded"]
    });
    await setTextInputValue(page, `input#sso_username`, process.env.USER_NAME);
    await setTextInputValue(page, `input#ssopassword`, process.env.USER_PASSWORD);
    await page.click("a[href='javascript:doLogin(document.LoginForm);']");
    await page.waitForSelector(".flat-grid-cell>.app-nav-item svg[data-icon='navi_ledgerclock']", { visible: true })
    await page.click(".flat-grid-cell>.app-nav-item svg[data-icon='navi_ledgerclock']");


    const checkForDataUpdate = async () => {
      const DB_data = await getDB_data()
      const OTL_data = await getOTL_data(page)

      const isSame = compareData(DB_data, OTL_data);
      if (!!isSame) {
        return await { response: "Data are same" }
      }
      const fullInfoSelector = "table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr:nth-child(1) > td:nth-child(10) img";
      await page.waitForSelector(fullInfoSelector, { visible: true })
      await page.hover(fullInfoSelector);
      await page.click(fullInfoSelector);
    };


    const areUpdates = await checkForDataUpdate();

    console.log(areUpdates);
  } catch (error) {
    console.error(error);
  }
}

getData();