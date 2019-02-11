const parsing = require('./src/parsing');
require('dotenv/config');

console.log("Parsing start");
// Parsing for one user 
const result = await parsing({
  URL: process.env.URL,
  USER_NAME: process.env.USER_NAME,
  USER_PASSWORD: process.env.USER_PASSWORD
});
console.log(result);