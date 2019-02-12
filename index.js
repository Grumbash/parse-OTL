require('dotenv/config');
const asyncStart = require("./asyncStart");

const { URL } = process.env;
const users = [{
  USER_NAME: process.env.USER_NAME,
  USER_PASSWORD: process.env.USER_PASSWORD
}];

asyncStart(users, URL);

