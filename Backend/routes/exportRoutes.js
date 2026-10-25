const express = require("express");

const router = express.Router(); 
const { exportAsPDF, exportAsDocument } = require("../controller/exportController"); 
const { protect } = require("../middleware/authMiddleware");

router.get("/:id/pdf", protect, exportAsPDF);
router.get("/:id/docx", protect, exportAsDocument);

module.exports = router;