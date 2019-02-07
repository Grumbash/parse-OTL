import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: String,
  period: [{
    No: Number,
    from: Date,
    to: Date,
    projects: [{
      PO: Number,
      name: String,
      days: [Number]
    }]
  }]
});

export default UserSchema = model("users", UserSchema, "users");