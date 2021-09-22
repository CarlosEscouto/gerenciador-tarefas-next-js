import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: [true, '* Campos obrigatório!']},
  email: { type: String, required: [true, '* Campos obrigatório!']},
  password: { type: String, required: [true, '* Campos obrigatório!']},
});

export const UserModel = mongoose.models.users || mongoose.model('users', UserSchema);