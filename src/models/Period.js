const { Schema, model, SchemaTypes } = require("mongoose");

const PeriodSchema = new Schema({
  week: Number,
  from: Date,
  to: Date,
});

module.exports = PeriodSchema = model("periods", PeriodSchema, "periods");
