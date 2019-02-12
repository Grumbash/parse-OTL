const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  period: [{
    from: Date,
    to: Date,
    status: String,
    projects: [{
      PO: Number,
      name: String,
      days: [Number]
    }]
  }]
});

module.exports = UserSchema = model("users", UserSchema, "users");