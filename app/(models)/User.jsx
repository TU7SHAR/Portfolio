import mongoose, { Schema } from "mongoose";

// Connection is handled by app/lib/db.js (dbConnect) — no top-level connect,
// which used to fire (and fail) at build time when MONGO_URI was unset.
const userSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
