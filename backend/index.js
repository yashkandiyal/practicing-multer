const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const multer = require("multer");
const status = require("express-status-monitor");
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(status());
const PORT = 3000;

app.post("/one-shot", upload.single("inputFile"), (req, res) => {
  const file = req.file;
  if (!file) {
    res.send(400).json("provide a file");
  }
  console.log(file);
  const chunkSize = 100 * 1024 * 1024;
  const fileSize = file.size;
  const NumberOfChunks = Math.ceil(fileSize / chunkSize);
  console.log(NumberOfChunks);
  res.json({ message: "File uploaded successfully", file: file });
});
app.post("/parallel-upload", upload.single("inputFile"), (req, res) => {
  // so the approach is simple whatever the size of the file is we will divide it by the chunk size we want
  const file = req.file;
  if (!file) {
    res.send(400).json("provide a file");
  }
  const chunkSize = 100 * 1024 * 1024;
  const fileSize = file.size;
  const NumberOfChunks = Math.ceil(fileSize / chunkSize);
});
app.post("/aws-upload", upload.single("inputFile"), (req, res) => {});

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
