const logger = require("../../logger");
exports.setTextInputValue = async (page, selector, value) => {
  try {
    await page.waitFor(selector);
    await page.type(selector, value, { delay: 100 })
  } catch (error) {
    logger.error(error);
  }
}
