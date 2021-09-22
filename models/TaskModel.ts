import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema({
  name: { type: String, required: [true, '* Campos obrigatório!']},
  userId: { type: String, required: [true, '* Campos obrigatório!']},
  expectedfinishAt: { type: Date, required: [true, '* Campos obrigatório!']},
  finishAt: { type: Date, required: [true, '* Campos obrigatório!']},
});

export const TaskModel = mongoose.models.tasks || mongoose.model('tasks', TaskSchema);
