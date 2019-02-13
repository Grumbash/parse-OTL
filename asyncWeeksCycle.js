const parsing = require('./src/parsing');
const User = require("./src/models/User");

module.exports = async ({ USER_NAME, USER_PASSWORD }, URL) => {
  console.log("Parsing start");
  try {
    const weekNo = 1;
    const user = {
      name: USER_NAME,
      period: await parsing({
        URL,
        USER_NAME,
        USER_PASSWORD
      }, weekNo)
    }

    const result = await new User(user).save();

    console.log(result);

    return result;

  } catch (error) {
    console.log(error)
  }
}
