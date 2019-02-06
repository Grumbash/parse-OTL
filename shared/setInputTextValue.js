export const setTextInputValue = async (page, selector, value) => {
  await page.waitFor(selector);
  await page.evaluate((data) => {
    return document.querySelector(data.selector).value = data.value
  }, { selector, value })
}
