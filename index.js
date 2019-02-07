import puppeteer from 'puppeteer';
import 'dotenv/config';
import { setTextInputValue } from "./shared/setInputTextValue";

async function getPic() {
  const browser = await puppeteer.launch({ headless: false, args: ['--window-size=1920,1080'] });
  const page = await browser.newPage();
  await page.goto(process.env.URL, {
    waitUntil: ['networkidle0', "domcontentloaded"]
  });
  await setTextInputValue(page, `input#sso_username`, process.env.USER_NAME);
  await setTextInputValue(page, `input#ssopassword`, process.env.USER_PASSWORD);
  await page.click("a[href='javascript:doLogin(document.LoginForm);']");
  await page.waitForSelector(".flat-grid-cell>.app-nav-item svg[data-icon='navi_ledgerclock']")
  await page.click(".flat-grid-cell>.app-nav-item svg[data-icon='navi_ledgerclock']");


}

getPic();