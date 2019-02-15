const getFullData = require("./getElemdata");

module.exports = async (page, arr) => {
  const result = [];
  console.log("Async Array");
  for (let index = 0; index < arr.length; index++) {
    result.push(await getFullData(page, index))

  }

  return result;
}