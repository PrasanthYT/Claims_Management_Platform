const express = require("express");
const multer = require("multer");
const { submitClaim, getClaims, updateClaim } = require("../controllers/claimController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Multer Config for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("document"), submitClaim);
router.get("/", authMiddleware, getClaims);
router.put("/:id", authMiddleware, updateClaim);

module.exports = router;
