const { Schema, model } = require("mongoose");

const ProjectSchema = new Schema(
  {
    period: {
      type: "ObjectId",
      ref: "periods"
    },
    PO: Number,
    name: String,
    days: [Number],
    total: Number
  },
  {
    timestamps: true
  }
);

module.exports = Project = model("projects", ProjectSchema, "projects");