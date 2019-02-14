const parsingMonth = require('./src/parsing');
const User = require("./src/models/User");

module.exports = async ({ USER_NAME, USER_PASSWORD }, URL) => {
  console.log("Parsing start");
  try {
    const user = await User.findOne({ name: USER_NAME });
    if (user.period.length === 0) {
      // get All info
      const weekNo = 1;
      const userToUpdate = {
        name: USER_NAME,
        period: await parsingAll({
          URL,
          USER_NAME,
          USER_PASSWORD
        }, weekNo)
      }

      const result = await new User(userToUpdate).save();

      console.log(result);

      return result;

    } else {
      // get Last month info
      const userToUpdate = {
        name: USER_NAME,
        period: await parsingMonth({
          URL,
          USER_NAME,
          USER_PASSWORD
        })
      }

      await User.findByIdAndUpdate(user.id, userToUpdate);

      const result = await User.findById(user.id);

      console.log(result);

      return result;
    }


  } catch (error) {
    console.log(error)
  }
}
