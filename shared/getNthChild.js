export const getNthChild = async (page, selector, nChild, childSelector) => {
  await page.evaluate(({ selector, nChild }) => {
    return selector.childNodes[nChild].querySelector(childSelector).textContent
  }, { selector, nChild })
}