const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = 3000;

// ✅ Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath); // Ensure directory exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Feedback endpoint
app.post('/api/feedback', upload.single('screenshot'), (req, res) => {
  const { name, email, subject, message, stars } = req.body;
  const screenshotPath = req.file ? `/uploads/${req.file.filename}` : null;

  const feedback = {
    name,
    email,
    subject,
    message,
    stars,
    screenshot: screenshotPath,
    timestamp: new Date().toISOString()
  };

  console.log("📩 Feedback received:", feedback);

  res.json({ success: true, data: feedback });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
