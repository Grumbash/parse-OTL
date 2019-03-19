const parsingMonth = require('./src/parsing');
const parsingAll = require('./src/parsing');
const User = require("./src/models/User");
const logger = require("./logger");

module.exports = async ({ USER_NAME, USER_PASSWORD }, URL) => {
  logger.info({ message: "Parsing start" });
  try {
    let user = await User.findOne({ name: USER_NAME });
    const parsingRes = await parsingMonth({
      URL,
      USER_NAME,
      USER_PASSWORD
    }, user.id);

    if (!user) {
      // get All info
      const user = await new User({ name: USER_NAME }).save();
      const userToUpdate = {
        name: USER_NAME,
        periods: parsingRes.periods,
        screen: parsingRes.screen
      }
      await User.findByIdAndUpdate(user.id, userToUpdate);
      const result = await User.findById(user.id);

      logger.info({ message: `User ${result.name} has been created` })

      return result;

    } else {
      // get Last month info

      const userToUpdate = {
        name: USER_NAME,
        periods: parsingRes.periods,
        screenshot: parsingRes.screen
      }

      const userOld = await User.findById(user.id);
      const arrOfPeriods = [...userToUpdate.periods, ...userOld.periods];
      userToUpdate.periods = arrOfPeriods.filter((periodId, index, self) => index === self.findIndex((innerPeriodId) => innerPeriodId == periodId));

      await User.findByIdAndUpdate(user.id, userToUpdate);

      const result = await User.findById(user.id);

      logger.info({ message: `User ${result.name} has been updated` });

      return result;
    }


  } catch (error) {
    logger.error(error)
  }
}
