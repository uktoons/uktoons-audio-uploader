const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://uktoonspro:Iamuktoons,081976@uktoons.9ru0ng2.mongodb.net/?retryWrites=true&w=majority&appName=uktoons', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define Music schema and model
const MusicSchema = new mongoose.Schema({
    title: String,
    artist: String,
    filename: String
});

const Music = mongoose.model('Music', MusicSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware to serve static files
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Routes
app.post('/upload', upload.single('musicFile'), async (req, res) => {
    try {
        // Save uploaded music file details to the database
        const { title, artist } = req.body;
        const filename = req.file.filename;
        const music = new Music({ title, artist, filename });
        await music.save();
        res.send('Music uploaded successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get('/music', async (req, res) => {
    try {
        // Retrieve all uploaded music files from the database
        const music = await Music.find({});
        res.json(music);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Handle other requests by serving the index.html file
app.get('*', (req, res) => {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
