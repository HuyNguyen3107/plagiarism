const express = require("express");
const router = express.Router();
const {
  upload,
  uploadFile,
  getFiles,
} = require("../controllers/fileController");

router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getFiles);

module.exports = router;
