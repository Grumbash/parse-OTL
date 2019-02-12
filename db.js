const mongoose = require("mongoose");
require('dotenv/config');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));