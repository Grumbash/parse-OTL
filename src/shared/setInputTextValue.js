const logger = require("../../logger");
exports.setTextInputValue = async (page, selector, value) => {
  try {
    await page.waitFor(selector);
    await page.evaluate((data) => {
      return document.querySelector(data.selector).value = data.value
    }, { selector, value })
  } catch (error) {
    logger.error(error);
  }
}
