const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    claimAmount: { type: Number, required: true },
    description: { type: String, required: true },
    document: { type: String, required: true },
    status: { type: String, default: "Pending" },
    approvedAmount: { type: Number, default: 0 },
    insurerComments: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Claim", claimSchema);
