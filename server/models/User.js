const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "insurer"], required: true }
});

module.exports = mongoose.model("Users", userSchema);
