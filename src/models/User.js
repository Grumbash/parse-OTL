const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: String,
  period: [{
    from: Date,
    to: Date,
    projects: [{
      PO: Number,
      name: String,
      days: [Number]
    }]
  }]
});

module.exports = UserSchema = model("users", UserSchema, "users");