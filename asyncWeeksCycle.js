const parsingMonth = require('./src/parsing');
const parsingAll = require('./src/parsing');
const User = require("./src/models/User");

module.exports = async ({ USER_NAME, USER_PASSWORD }, URL) => {
  console.log("Parsing start");
  try {

    let user = await User.findOne({ name: USER_NAME });
    if (!user) {
      // get All info
      const newUser = await new User({ name: USER_NAME }).save();
      const userToUpdate = {
        name: USER_NAME,
        periods: await parsingAll({
          URL,
          USER_NAME,
          USER_PASSWORD
        }, newUser.id)
      }

      await User.findByIdAndUpdate(newUser.id, userToUpdate);
      const result = await User.findById(newUser.id);

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

      await User.findByIdAndUpdate(user.id, userToUpdate);

      const result = await User.findById(user.id);

      console.log("-------------  Updated user  -------------");

      return result;
    }


  } catch (error) {
    console.log(error)
  }
}
