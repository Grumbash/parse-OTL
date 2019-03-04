const parsingMonth = require('./src/parsing');
const parsingAll = require('./src/parsing');
const User = require("./src/models/User");

module.exports = async ({ USER_NAME, USER_PASSWORD }, URL) => {
  console.log("Parsing start");
  try {

    let user = await User.findOne({ name: USER_NAME });
    if (!user) {
      // get All info
      const user = await new User({ name: USER_NAME }).save();
      const userToUpdate = {
        name: USER_NAME,
        periods: await parsingAll({
          URL,
          USER_NAME,
          USER_PASSWORD
        }, user.id)
      }
      const userOld = await User.findById(user.id)
      userToUpdate.periods = [...userToUpdate.periods, ...userOld.periods]
      await User.findByIdAndUpdate(user.id, userToUpdate);
      const result = await User.findById(user.id);

      console.log("-------------  Created new user  -------------")

      return result;

    } else {
      // get Last month info
      const userToUpdate = {
        name: USER_NAME,
        periods: await parsingMonth({
          URL,
          USER_NAME,
          USER_PASSWORD
        }, user.id)
      }

      const userOld = await User.findById(user.id)
      userToUpdate.periods = [...userToUpdate.periods, ...userOld.periods]

      await User.findByIdAndUpdate(user.id, userToUpdate);

      const result = await User.findById(user.id);

      console.log("-------------  Updated user  -------------");

      return result;
    }


  } catch (error) {
    console.log(error)
  }
}
