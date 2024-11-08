const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('your_mongodb_connection_string', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema for storing file metadata
const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
  const fileData = new File({
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size
  });
  fileData.save()
    .then(doc => res.json({ message: 'File uploaded successfully', file: doc }))
    .catch(err => res.status(400).json({ error: err }));
});

app.get('/files', (req, res) => {
  File.find()
    .then(files => res.json(files))
    .catch(err => res.status(500).json({ error: err }));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
