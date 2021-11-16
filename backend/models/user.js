import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  roleId: { type: mongoose.Schema.ObjectId, ref: "roles" },//no son datos primitivos lleva type, hace referencia a cl roles
  dbStatus: Boolean,
  registerDate: { type: Date, default: Date.now },
});

const user = mongoose.model("users", userSchema);
export default user;
