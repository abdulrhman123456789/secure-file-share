const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

// إعداد التخزين للملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomBytes(8).toString('hex') + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// عرض الملفات الثابتة
app.use(express.static('public'));

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// استقبال الملف وحفظه
app.post('/upload', upload.single('file'), (req, res) => {
  const fileUrl = `/file/${req.file.filename}`;
  res.redirect(`/success.html?url=${encodeURIComponent(fileUrl)}`);
});

// صفحة تحميل الملف
app.get('/file/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('الملف غير موجود');
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));