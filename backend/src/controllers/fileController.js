const multer = require("multer");
const path = require("path");
const { Uploaded_File } = require("../models/index");
const { log } = require("console");
// const { extractTextWithPosition } = require("../utils/plagiarism");
const WordExtractor = require("word-extractor");
const docxConverter = require("docx-pdf");

const fs = require("fs");
const libre = require("libreoffice-convert");

// Cấu hình multer để lưu file vào thư mục uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Xử lý upload file
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded!" });
    }

    const { filename, path: filepath } = req.file;

    // Lưu vào database
    const fileRecord = await Uploaded_File.create({
      name: filename,
      path: filepath,
    });

    res.json({ message: "File uploaded successfully!", file: fileRecord });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "File upload failed!" });
  }
};

// Lấy danh sách file đã upload
const getFiles = async (req, res) => {
  try {
    const files = await Uploaded_File.findAll();
    // const extractor = new WordExtractor();
    // const extracted = await extractor.extract(files[0].dataValues.path);
    // console.log(extracted);
    // console.log(files[0].dataValues);
    const filePath = files[0].dataValues.path;
    let fileName = files[0].dataValues.name;
    fileName = fileName.split(".")[0] + ".pdf";

    const file = fs.readFileSync(filePath);
    const outputPath = `uploads/pdf/${fileName}`;

    libre.convert(file, ".pdf", undefined, (err, done) => {
      if (err) {
        console.error(`❌ Lỗi chuyển file:`, err);
        return;
      }

      fs.writeFileSync(outputPath, done);
      console.log("✅ Chuyển thành công:", outputPath);
    });

    // docxConverter(filePath, `uploads/pdf/${fileName}`, function (err, result) {
    //   if (err) {
    //     console.log(err);
    //   }
    //   console.log("result" + result);
    // });
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve files!" });
  }
};

module.exports = { upload, uploadFile, getFiles };
