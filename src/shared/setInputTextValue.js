exports.setTextInputValue = async (page, selector, value) => {
  await page.waitFor(selector);
  await page.type(selector, value, { delay: 100 });
}
