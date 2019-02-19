const { Schema, model } = require("mongoose");

const PeriodSchema = new Schema(
  {
    user: {
      type: "ObjectId",
      ref: "users"
    },
    from: String,
    to: String,
    status: String,
    projects: [{
      type: "ObjectId",
      ref: "projects"
    }]
  },
  {
    timestamps: true
  }
);

module.exports = Period = model("periods", PeriodSchema, "periods");