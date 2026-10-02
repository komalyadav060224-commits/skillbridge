const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const authMiddleware = require("../middleware/authMiddleware");
const {uploadResume, matchResume, getMyResume, matchResumeWithFile, generateResume} = require("../controllers/resumeController");

router.post('/upload', authMiddleware, upload.single("resume"), uploadResume);
router.post('/match', authMiddleware, matchResume);
router.get('/me', authMiddleware, getMyResume);
router.post('/match-upload', authMiddleware, upload.single("jobFile"), matchResumeWithFile);
router.post('/generate', authMiddleware, generateResume);

module.exports = router;