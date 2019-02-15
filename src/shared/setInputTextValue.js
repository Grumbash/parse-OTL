exports.setTextInputValue = async (page, selector, value) => {
  await page.waitFor(selector);
  // await page.evaluate((data) => {
  //   document.querySelector(data.selector).value = ;

  // }, { selector, value })
  await page.type(selector, value, { delay: 100 });
}
