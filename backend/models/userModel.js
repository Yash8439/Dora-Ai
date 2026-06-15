import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, unique: true, required: true },
   avatar: String,
   credits: { type: Number, default: 100, min: 0 },
   plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },
   role: { type: String, enum: ["user", "admin"], default: "user" } // ✅ Admin role
}, { timestamps: true })

export const User = mongoose.model('User', userSchema)