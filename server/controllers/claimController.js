const Claim = require("../models/Claim");

// Submit a claim
exports.submitClaim = async (req, res) => {
    try {
        const { name, email, claimAmount, description } = req.body;
        const document = req.file ? req.file.filename : null;

        if (!document) return res.status(400).json({ message: "Document is required" });

        const newClaim = new Claim({ name, email, claimAmount, description, document });
        await newClaim.save();
        res.status(201).json(newClaim);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all claims
exports.getClaims = async (req, res) => {
    try {
        const claims = await Claim.find();
        res.status(200).json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update claim (Approve/Reject)
exports.updateClaim = async (req, res) => {
    try {
        const { status, approvedAmount, insurerComments } = req.body;
        const claim = await Claim.findByIdAndUpdate(req.params.id, { status, approvedAmount, insurerComments }, { new: true });

        if (!claim) return res.status(404).json({ message: "Claim not found" });
        res.status(200).json(claim);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
