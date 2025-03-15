const Claim = require("../models/Claim");

// Submit a claim
exports.submitClaim = async (req, res) => {
  try {
    const { name, email, claimAmount, description } = req.body;
    const userId = req.user.id; // Assuming user ID is extracted from token

    const newClaim = new Claim({
      user: userId,
      name,
      email,
      claimAmount,
      description,
      document:
        "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg", // Default document
    });

    await newClaim.save();
    res.status(201).json(newClaim);
  } catch (error) {
    console.error("Error:", error);
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
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      { status, approvedAmount, insurerComments },
      { new: true }
    );

    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.status(200).json(claim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get claims by user ID from JWT token
exports.getUserClaims = async (req, res) => {
  try {
    // Extract user info from the auth middleware
    const userId = req.user.id; // User ID extracted from the decoded JWT

    // Fetch claims for this user
    const userClaims = await Claim.find({ userId });

    if (!userClaims.length) {
      return res.status(404).json({ message: "No claims found for this user" });
    }

    res.status(200).json(userClaims);
  } catch (error) {
    console.error("Error fetching user claims:", error);
    res.status(500).json({ error: error.message });
  }
};
