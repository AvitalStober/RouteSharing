import User from "@/app/types/users";
import mongoose, { Model, Schema } from "mongoose";

const UsersSchema: Schema<User> = new Schema({
  fullName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  historyRoutes: { type: [Schema.Types.ObjectId], required: true },
  // ownerRoutes: { type: [Schema.Types.ObjectId], required: true }
});

const Users: Model<User> =
  mongoose.models.users || mongoose.model("users", UsersSchema);

export default Users;
