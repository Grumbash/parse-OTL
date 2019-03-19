const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    periods: [{
      type: "ObjectId",
      ref: "periods"
    }],
    screenshot: String
  },
  {
    timestamps: true
  }
);

module.exports = User = model("users", UserSchema, "users");