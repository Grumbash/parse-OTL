const parsingMonth = require ('./src/parsing');
const User = require ('./src/models/User');
const logger = require ('./logger');

module.exports = async ({USER_NAME, USER_PASSWORD}, URL) => {
  logger.info ({message: `${USER_NAME} -- parsing start`});

  try {
    let user = await User.findOne ({name: USER_NAME});
    const parsingRes = async userInner =>
      await parsingMonth (
        {
          URL,
          USER_NAME,
          USER_PASSWORD,
        },
        userInner.id
      );

    if (!user) {
      const user = await new User ({name: USER_NAME}).save ();

      logger.info ({message: `Add ${user.name} as new in DB`});

      const res = await parsingRes (user);
      const userToUpdate = {
        name: USER_NAME,
        periods: res.periods,
        screenshot: res.screen,
      };
      await User.findByIdAndUpdate (user.id, userToUpdate);
      const result = await User.findById (user.id);

      logger.info ({message: `User ${result.name} has been created`});

      return result;
    } else {
      // get Last month info
      const res = await parsingRes (user);
      const userToUpdate = {
        name: USER_NAME,
        periods: res.periods,
        screenshot: res.screen,
      };

      const userOld = await User.findById (user.id);
      const arrOfPeriods = [...userToUpdate.periods, ...userOld.periods];
      userToUpdate.periods = arrOfPeriods.filter (
        (periodId, index, self) =>
          index === self.findIndex (innerPeriodId => innerPeriodId == periodId)
      );

      await User.findByIdAndUpdate (user.id, userToUpdate);

      logger.info ({message: `Update  ${user.name} in DB`});

      const result = await User.findById (user.id);

      logger.info ({message: `User ${result.name} has been updated`});

      return result;
    }
  } catch (error) {
    logger.error (error);
  }
};
