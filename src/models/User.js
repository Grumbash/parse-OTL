const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    periods: [{
      from: String,
      to: String,
      status: String,
      projects: [{
        PO: Number,
        name: String,
        days: [Number]
      }]
    }]
  },
  {
    timestamps: true
  }
);

module.exports = User = model("users", UserSchema, "users");