import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(' Connected to MongoDB'))
    .catch((err) => console.error(' MongoDB connection error:', err));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Skill-Gap Analyzer backend is running.' });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});