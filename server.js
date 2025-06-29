const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { execFile } = require('child_process');

const app = express();
const PORT = 3000;

// ✅ Setup Multer storage for file uploads (used in feedback form)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.send("✅ AgroAI Backend is running successfully!");
});


// ✅ Feedback API
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
  res.status(200).json({ success: true, data: feedback });
});

// ✅ Crop Prediction API
app.post('/predict', (req, res) => {
  const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

  // Validate incoming data (basic)
  if ([N, P, K, temperature, humidity, ph, rainfall].some(v => v === undefined)) {
    return res.status(400).json({ error: 'Missing one or more required parameters' });
  }

  const args = [N, P, K, temperature, humidity, ph, rainfall];
  const modelPath = path.join(__dirname, 'model', 'predictor.py');

  execFile('python', [modelPath, ...args], (error, stdout, stderr) => {
    if (error) {
      console.error('❌ ML Model Execution Error:', error);
      return res.status(500).json({ error: 'Prediction failed. Check logs for more info.' });
    }

    const prediction = stdout.trim();
    console.log('🌾 Crop Prediction:', prediction);
    res.status(200).json({ prediction });
  });
});

// ✅ Start server
app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server is running at: http://localhost:${process.env.PORT || 3000}`);
});
