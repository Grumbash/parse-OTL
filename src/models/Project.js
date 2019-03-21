const { Schema, model } = require("mongoose");

const ProjectSchema = new Schema(
  {
    period: {
      type: "ObjectId",
      ref: "periods"
    },
    PO: Number,
    name: String,
    planned: {
      default: 0,
      type: Number
    },
    uiName: {
      default: "",
      type: String
    },
    PM: {
      default: "",
      type: String
    },
    uiNameForRead: {
      default: "",
      type: String
    },
    days: [Number],
    total: Number
  },
  {
    timestamps: true
  }
);
module.exports = Project = model("projects", ProjectSchema, "projects");