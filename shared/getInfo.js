import moment from "moment";

export default async (page) => {

  // Find the table of weeks
  const table = document.querySelector("table[summary='Search Results:Time Cards'] > colgroup[span] + tbody");

  // Find a row
  let row = table.childNodes[0];

  // Find a column in the row
  let column = row.childNodes[0].querySelector("span[class='x2qb']")

  // Click on column of 9'th

  const result = await page.evaluate(htmlElement => {

    for (let index = 0; index < htmlElement.childNodes.length; index++) {
      const firstDayOfWeek = htmlElement.childNodes[index].childNodes[0].querySelector("span[class='x2qb']").textContent.split(" - ")[0];
      if (firstDayOfWeek) {

      }

    }
    htmlElement.childNodes

  }, table);
}