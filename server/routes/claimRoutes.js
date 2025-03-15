const express = require("express");
const { submitClaim, getClaims, updateClaim, getUserClaims } = require("../controllers/claimController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Routes
router.post("/", authMiddleware, submitClaim);
router.get("/", authMiddleware, getClaims);
router.put("/:id", authMiddleware, updateClaim);
router.get("/my-claims", getUserClaims);

module.exports = router;
