const ProjectModel = require("../models/Project");

module.exports = async ({ page, selector }, periodId) => {
  try {
    await page.waitForSelector(selector, { visible: true });
    const projects = await page.evaluate(selec => {
      // Get rows from first table 
      const rows = [...document.querySelectorAll(selec)];
      return rows.map(row => {
        const childrenCollection = [...row.children];
        // Sturucture data to send in DB
        const project = {
          PO: childrenCollection[0].textContent.split(" - ")[0],
          name: childrenCollection[0].textContent.split(" - ")[1],
          days: childrenCollection.slice(2, 9).map(elem => !!+elem.textContent ? +elem.textContent : 0),
          total: +childrenCollection[9].textContent
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
    console.log(error);
    return [];
  }
}