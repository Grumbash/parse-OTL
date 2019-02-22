const { Schema, model } = require("mongoose");

const CredSchema = new Schema({
  login: String,
  password: String
})

module.exports = CredModel = model("creds", CredSchema, "creds")