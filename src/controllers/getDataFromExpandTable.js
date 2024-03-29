const ProjectModel = require("../models/Project");
const logger = require("../../logger");

module.exports = async ({ page, selector }, periodId, USER_NAME) => {
  logger.info({ message: `Getting data from expanded table` });
  try {
    await page.waitForSelector(selector, { visible: true });
    const headersSelector = 'table[summary="This table contains column headers corresponding to the data body table below"]';
    //photo
    const screen = await page.screenshot({
      path: 'screenshots/periods/' + USER_NAME + '_period-' + periodId + '.png',
      fullPage: true,
      encoding: 'base64'
    });

    logger.info({ message: `Do screenshot 'screenshots/periods/${USER_NAME}_period-${periodId}.png'` });
    // Get metadata from tabel-header
    logger.info({ message: `Getting metadata from tabel-header` });
    const headers = await page.evaluate((headersSelector) => [...document.querySelectorAll(headersSelector)[1].children[1].children[1].children].map(child => ({ name: child.textContent, index: child.getAttribute("_d_index") })), headersSelector);

    const fieldsOrder = {
      project: +headers.find(elem => elem.name.trim().toUpperCase() === "project".toUpperCase()).index,
      daysFrom: +headers.find(elem => elem.name.trim().toUpperCase() === "days".toUpperCase()).index,
      daysTo: +headers.find(elem => elem.name.trim().toUpperCase() === "days".toUpperCase()).index + 7,
      total: +headers.find(elem => elem.name.trim().toUpperCase() === "Time Entry Total Hours".toUpperCase()).index,
    }

    logger.info({ message: `Getting projects from table` });
    const projects = await page.evaluate(({ selec, fieldsOrder }) => {
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
    }, ({ selec: selector, fieldsOrder }));

    const ids = [];
    for (const project of projects) {
      const dbProject = await ProjectModel.findOne({ PO: project.PO, period: periodId });
      let uiNameForProject = await ProjectModel.find({ PO: project.PO }).then(projectsLoc => projectsLoc[0].uiName).catch(error => {
        console.error(error)
        logger.error(error);
        return null;
      });
      if (uiNameForProject === null) {
        uiNameForProject = "";
      }
      if (dbProject) {
        await ProjectModel.findByIdAndUpdate(dbProject.id, { ...project, period: periodId, uiName: uiNameForProject })
        const modifiedProject = await ProjectModel.findById(dbProject.id);
        ids.push(modifiedProject)
      } else {
        ids.push(await new ProjectModel({ ...project, period: periodId }).save())
      }
    }
    logger.info({ message: `Return array projects ids and screens` });
    return [ids, screen];
  } catch (error) {
    logger.error(error);
    return [];
  }
}