import { Schema, model, SchemaTypes } from "mongoose";

const PeriodSchema = new Schema({
  week: Number,
  from: Date,
  to: Date,
});

export default PeriodSchema = model("periods", PeriodSchema, "periods");
