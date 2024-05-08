const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const fs = require("fs");


const app = express();
const PORT = 3000;

// Multer configuration for local storage
const localUpload = multer({ dest: "uploads/" });

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// One-shot upload route where we receive the file from frontend and it is moved to the /uploads folder
app.post("/one-shot", localUpload.single("file"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ message: "File uploaded successfully", file: file });
});

// Parallel uploads with chunking route
app.post("/parallel", localUpload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Calculate number of chunks in our case it is 100MB
  const fileSizeInBytes = fs.statSync(file.path).size;
  const chunkSize = 100 * 1024 * 1024; // 100MB
  const numberOfChunks = Math.ceil(fileSizeInBytes / chunkSize);

  // Upload chunks in parallel
  const promises = [];
  for (let i = 0; i < numberOfChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, fileSizeInBytes);
    const chunkStream = fs.createReadStream(file.path, { start, end });
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${file.originalname}-${i + 1}`,
      Body: chunkStream,
    };
    const promise = s3.upload(params).promise();
    promises.push(promise);
  }

  // Wait for all uploads to finish
  await Promise.all(promises);

  res.json({ message: "File uploaded successfully" });
});

// Direct upload to AWS S3 route (it is in progress)

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
