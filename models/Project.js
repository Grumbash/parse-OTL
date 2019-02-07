import { Schema, model } from "mongoose";

const ProjectSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  PO: Number,
  name: String,
  days: [Number]
});

export default ProjectSchema = model("projects", ProjectSchema, "projects");