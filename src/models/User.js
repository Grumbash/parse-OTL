const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  periods: [{
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

module.exports = User = model("users", UserSchema, "users");