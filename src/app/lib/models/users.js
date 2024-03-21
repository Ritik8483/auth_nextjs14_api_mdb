import { Schema, model, models } from "mongoose";

const UsersTableSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    token: { type: String },
    username: {
      type: String,
      required: [true, "First name is required"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", UsersTableSchema);
export default User;
