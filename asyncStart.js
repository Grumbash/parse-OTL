const parsing = require('./src/parsing');

module.exports = async (users, URL) => {
  // Parsing for many user
  console.log("Parsing start")
  for (const elem of users) {
    const { USER_NAME, USER_PASSWORD } = elem;
    try {
      console.log(elem)
      const weekNo = 1;
      const result = await parsing({
        URL,
        USER_NAME,
        USER_PASSWORD
      }, weekNo);

      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

}
