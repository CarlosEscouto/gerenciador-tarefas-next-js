import mongoose, { Schema } from "mongoose";

/** @type {*} */
const TaskSchema = new Schema({
  name: { type: String, required: [true, "* Campos obrigatório!"] },
  userId: { type: String, required: [true, "* Campos obrigatório!"] },
  expectedfinishAt: { type: Date, required: [true, "* Campos obrigatório!"] },
  finishAt: { type: Date },
});

export const TaskModel =
  mongoose.models.tasks || mongoose.model("tasks", TaskSchema);
