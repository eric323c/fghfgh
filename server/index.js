const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb+srv://eric32301:9Opayd8AfDaKe1PK@thirdshifthub.fntli.mongodb.net/?retryWrites=true&w=majority&appName=ThirdShiftHub', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// MongoDB schema and model
const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Route for file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  
  const fileData = new File({
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
  });

  fileData.save()
    .then(() => res.json({ message: 'File uploaded successfully', file: req.file }))
    .catch(err => res.status(500).json({ error: 'Failed to save file metadata.' }));
});

// Route to fetch all uploaded files
app.get('/files', (req, res) => {
  File.find()
    .then(files => res.json(files))
    .catch(err => res.status(500).json({ error: 'Failed to retrieve files.' }));
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
