const { Schema, model } = require("mongoose");

const PeriodSchema = new Schema({
  week: Number,
  from: Date,
  to: Date,
});

module.exports = Period = model("periods", PeriodSchema, "periods");
