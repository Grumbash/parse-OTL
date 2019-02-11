module.exports = async ({ page, selector }) => {
  try {
    await page.waitForSelector(selector, { visible: true });
    return await page.evaluate(selec => {
      // Get rows from first table 
      const rows = [...document.querySelectorAll(selec)];
      return rows.map(row => {
        const childrenCollection = [...row.children];
        // Sturucture data to send in DB
        return {
          PO: childrenCollection[0].textContent.split(" - ")[0],
          name: childrenCollection[0].textContent.split(" - ")[1],
          days: childrenCollection.slice(2, 9).map(elem => !!+elem.textContent ? +elem.textContent : 0),
          total: +childrenCollection[9].textContent
        }
      });
    }, selector);
  } catch (error) {
    console.log(error);
  }
}