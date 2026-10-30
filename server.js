const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Compass
mongoose.connect('mongodb://localhost:27017/isroDB')
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.error('Connection error:', err));

// Applicant Schema & Model
const applicantSchema = new mongoose.Schema({
    name: String,
    age: Number,
    discipline: String,
    city: String,
    email: { type: String, unique: true },
    password: String
});

const Applicant = mongoose.model('Applicant', applicantSchema);

// Registration Route
app.post('/api/register', async (req, res) => {
    try {
        const newApplicant = new Applicant(req.body);
        await newApplicant.save();
        res.json({ success: true, message: "Application Submitted Successfully & Saved to MongoDB!" });
    } catch (err) {
        res.json({ success: false, message: "Error: Email might already exist." });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const applicant = await Applicant.findOne({ email, password });
        
        if (applicant) {
            res.json({ success: true, applicant });
        } else {
            res.json({ success: false, message: "Invalid Email or Password!" });
        }
    } catch (err) {
        res.json({ success: false, message: "Server error." });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});