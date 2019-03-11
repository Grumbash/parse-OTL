const ProjectModel = require("../models/Project");
const logger = require("../../logger");

module.exports = async ({ page, selector }, periodId) => {
  try {
    const headersSelector = 'table[summary="This table contains column headers corresponding to the data body table below"]';
    await page.waitForSelector(headersSelector);

    // Get metadata from tabel-header
    const headers = await page.evaluate((async (headersSelector) => {
      const table = await document.querySelectorAll(headersSelector)[1];

      console.log(headersSelector)
      console.log(table)
      const tableHeaders = [...table.children[1].children[1].children]
      return tableHeaders;
    }), (headersSelector));

    const fieldsOrder = {
      project: +headers.find(elem => elem.textContent.trim().toUpperCase() === "project".toUpperCase()).getAttribute("_d_index"),
      daysFrom: +headers.find(elem => elem.textContent.trim().toUpperCase() === "days".toUpperCase()).getAttribute("_d_index"),
      daysTo: +headers.find(elem => elem.textContent.trim().toUpperCase() === "days".toUpperCase()).getAttribute("_d_index") + 7,
      total: +headers.find(elem => elem.textContent.trim().toUpperCase() === "Time Entry Total Hours".toUpperCase()).getAttribute("_d_index"),

    }

    await page.waitForSelector(selector, { visible: true });
    const projects = await page.evaluate(selec => {
      // Get rows from first table 
      const rows = [...document.querySelectorAll(selec)];
      return rows.map(row => {
        const childrenCollection = [...row.children];
        // Sturucture data to send in DB
        const project = {
          PO: childrenCollection[fieldsOrder.project - 1].textContent.split(" - ")[0],
          name: childrenCollection[fieldsOrder.project - 1].textContent.split(" - ")[1],
          days: childrenCollection.slice(fieldsOrder.daysFrom - 1, fieldsOrder.daysTo - 1).map(elem => !!+elem.textContent ? +elem.textContent : 0),
          total: +childrenCollection[fieldsOrder.total - 1].textContent
        };
        if (!project.total) {
          project.total = project.days.reduce((accum, current) => accum + current)
        }
        return project;
      });
    }, selector);
    const ids = [];
    for (const project of projects) {
      const dbProject = await ProjectModel.findOne({ PO: project.PO, period: periodId });
      if (dbProject) {
        await ProjectModel.findByIdAndUpdate(dbProject.id, { ...project, period: periodId })
        const modifiedProject = await ProjectModel.findById(dbProject.id);
        ids.push(modifiedProject)
      } else {
        ids.push(await new ProjectModel({ ...project, period: periodId }).save())
      }
    }
    return ids;
  } catch (error) {
    logger.error(error);
    return [];
  }
}