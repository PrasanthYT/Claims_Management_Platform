const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Relate to User model
    name: { type: String, required: true },
    email: { type: String, required: true },
    claimAmount: { type: Number, required: true },
    description: { type: String, required: true },
    document: { 
        type: String, 
        default: "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg" // Default static document URL
    },
    status: { type: String, default: "Pending" },
    approvedAmount: { type: Number, default: 0 },
    insurerComments: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Claim", claimSchema);
