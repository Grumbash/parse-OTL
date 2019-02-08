import moment from "moment";

export default async (page) => {
  await page.waitForSelector("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody");

  // Click on column of 9'th

  // const result = await page.evaluate(`(async () => {

  //   // Find the table of weeks
  //   const table = document.querySelector("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody");

  //   const rows = [...table.childNodes];
  //   const column = [
  //     ...rows
  //       .map(elem => elem.childNodes)
  //       .map(elem => ([...elem]))
  //   ];

  //   const data = column.map(e=>{
  //       const result = {
  //         period: e[0].textContent,
  //         status: e[2].textContent,
  //       }
  //       return result;
  //     })

  //   // .map((elem) => elem.filter((flatElem, index) => {
  //   //   if (index == 9) return flatElem;
  //   //   if (index == 2 || index == 0) return flatElem.textContent;
  //   // })))

  //   return data;


  // })()`);
  const lastDate = await page.evaluate(() => {
    const period = document.querySelectorAll("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr > td:nth-child(1)")[0].textContent;
    const status = document.querySelectorAll("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody > tr > td:nth-child(3)")[0].textContent;
    return {
      period,
      status
    }
  })
  return lastDate;
}