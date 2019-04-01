require ('dotenv/config');
const puppeteer = require ('puppeteer');
const mkdirp = require ('mkdirp');
const {setTextInputValue} = require ('./shared/setInputTextValue');
const moment = require ('moment');
const asyncProcessArray = require ('./controllers/asyncProcessArray');
const logger = require ('../logger');

async function parsing ({URL, USER_NAME, USER_PASSWORD}, userId) {
  const browser = await puppeteer.launch ({
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
    args: ['--window-size=1920,1080'],
  });

  logger.info ({message: `Browser has launched`});

  try {
    const page = await browser.newPage ();
    page.setDefaultTimeout (120000);
    await page.goto (URL, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
    });

    logger.info ({message: `Go to ${URL}`});

    await page.waitForSelector ('input#sso_username', {visible: true});
    await setTextInputValue (page, `input#sso_username`, USER_NAME);
    await setTextInputValue (page, `input#ssopassword`, USER_PASSWORD);

    await mkdirp ('screenshots/listOfPeriod/', err => {
      if (err) {
        logger.error (err);
        return;
      }
      mkdirp ('screenshots/periods/', err => {
        if (err) {
          logger.error (err);
          return;
        }
      });
    });
    await page.screenshot ({
      path: 'screenshots/' + USER_NAME + '.png',
      fullPage: true,
    });

    logger.info ({message: `Do screenshot 'screenshots/${USER_NAME}.png'`});

    await page.click ("a[href='javascript:doLogin(document.LoginForm);']");

    logger.info ({
      message: `Go to dashboard selector:.flat-grid-cell>.app-nav-item svg[data-icon='navi_ledgerclock']`,
    });

    await page.waitForSelector (
      ".flat-grid-cell>.app-nav-item svg[data-icon='navi_ledgerclock']",
      {visible: true}
    );
    await page.screenshot ({
      path: 'screenshots/' + USER_NAME + '_profile.png',
      fullPage: true,
    });

    logger.info ({
      message: `Do screenshot 'screenshots/${USER_NAME}_profile.png'`,
    });

    await page.click (
      ".flat-grid-cell>.app-nav-item svg[data-icon='navi_ledgerclock']"
    );

    logger.info ({message: `Go to periods table`});

    // Code below for picking data in particular period

    const firstDayOfMonth = moment (new Date ())
      .subtract (1, 'month')
      .startOf ('month')
      .format ('MM/DD/YY');
    const lastDayOfMonth = moment (new Date ())
      .endOf ('month')
      .format ('MM/DD/YY');
    await page.waitForSelector ('tr[style] > td:nth-child(3) > button', {
      visible: true,
    });
    await page.evaluate (
      ({firstDayOfMonth, lastDayOfMonth}) => {
        const fromInput = document.querySelectorAll ('input[id]')[3];
        const toInput = document.querySelectorAll ('input[id]')[5];
        const searchButton = document.querySelectorAll (
          'td[class] > button[id]'
        )[6];

        fromInput.value = firstDayOfMonth;
        toInput.value = lastDayOfMonth;
        searchButton.click ();
      },
      {firstDayOfMonth, lastDayOfMonth}
    );

    logger.info ({
      message: `Sort data -- from: ${firstDayOfMonth} to:${lastDayOfMonth}`,
    });

    const screen = await page.screenshot ({
      path: 'screenshots/listOfPeriod/' + USER_NAME + '_filterPeriods.png',
      fullPage: true,
      encoding: 'base64',
    });

    logger.info ({
      message: `Do screenshot 'screenshots/listOfPeriod/${USER_NAME}_filterPeriods.png'`,
    });

    await page.waitForSelector (
      "table[summary='Search Results:Time Cards'] > tbody > tr",
      {visible: true}
    );
    await page.waitFor (5000);

    const weeks = await page.evaluate (() => [
      ...document.querySelectorAll (
        "table[summary='Search Results:Time Cards'] > tbody > tr"
      ),
    ]);
    let periods = [];
    if (weeks.length) {
      periods = await asyncProcessArray (page, weeks, userId, USER_NAME);
    }

    browser.close ();
    logger.info ({message: `Close the browser`});

    return {periods, screen};
  } catch (error) {
    browser.close ();
    logger.error (error);
    return {periods: [], screen: ''};
  }
}

module.exports = parsing;
