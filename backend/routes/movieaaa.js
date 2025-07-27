const express = require("express");
const router = express.Router();
const { uploadVideo } = require("../middlewares/multer");

router.post("/upload-trailer", uploadVideo.single("video"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: "Trailer upload failed" });

  const fileUrl = `/trailers/${req.file.filename}`;
  res.status(201).json({
    message: "Trailer uploaded successfully",
    url: fileUrl,
  });
});

module.exports = router;
