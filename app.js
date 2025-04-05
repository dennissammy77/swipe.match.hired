const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const db = require("./config/database.js");
const authController = require("./controllers/auth.controller.js");

// Load environment variables from .env file
dotenv.config();
// initialize the db
db.connect();

// initialize the app
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors({
  credentials: true,
  origin: '*',
}));

app.use(express.json());
// Serve static files from the 'public' directory

/* -------------------------------- Server Routes --------------------------------- */
app.get('/api/jobs', (req, res) => {
    res.json([
        { id: 1, title: "Software Engineer", location: "Remote", company: "Company A" },
        { id: 2, title: "Data Scientist", location: "On-site", company: "Company B" },
        { id: 3, title: "Product Manager", location: "Hybrid", company: "Company C" },
        // Add more job listings as needed
    ]);
});
app.use('/api/signin', authController.SIGN_IN_USER);
app.use('/api/signup', authController.CREATE_USER);
/* -------------------------------- Navigations --------------------------------- */
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'index.html'));
});
app.get('/jobs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'jobs.html'));
});
app.get('/preferences', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'preferences.html'));
});
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'signin.html'));
});
app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

module.exports = app;
