const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const multer = require('multer'); // ✅ For file uploads
const fs = require('fs');

const app = express();
const PORT = 3000;

// ✅ Setup multer storage for uploaded screenshots
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath); // Create folder if not exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse form data (important for multipart forms)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Firebase REST endpoint (optional - use only if needed)
const FIREBASE_URL = "https://agroai-c0e2a-default-rtdb.firebaseio.com/AgroAI.json";
app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get(FIREBASE_URL);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error fetching from Firebase:", error.message);
    res.status(500).json({ error: 'Failed to fetch data from Firebase' });
  }
});

// ✅ Handle feedback POST with file upload
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

  // TODO: Save to Firebase or local file here if needed

  res.json({ success: true, data: feedback });
});

// ✅ Serve pages (for direct URL access support)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chart', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chart.html'));
});

app.get('/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'feedback.html'));
});

app.get('/suggest', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'suggest.html'));
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 AGRO AI server running at http://localhost:${PORT}`);
});
