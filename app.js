const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const db = require("./config/database.js");

const { AUTHENTICATE_TOKEN } = require("./middlewares/TOKEN_VERIFIER.middleware.js");
const { cache } = require("./middlewares/routeCache.js");
const authController = require("./controllers/auth.controller.js");
const userController = require("./controllers/user.controller.js");
const jobsController = require("./controllers/jobs.controller.js");

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
app.post('/api/signin', authController.SIGN_IN_USER);
app.post('/api/signup', authController.CREATE_USER);
app.get('/api/users/:userid',AUTHENTICATE_TOKEN, cache(3000),userController.FETCH_USER_DATA);
app.put('/api/users/:userid', userController.UPDATE_USER_DATA);
app.get('/api/jobs', AUTHENTICATE_TOKEN,cache(3000), jobsController.listJobs);
app.put('/api/jobs/save', AUTHENTICATE_TOKEN, jobsController.savedJob);
/* -------------------------------- Navigations --------------------------------- */
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'index.html'));
});
app.get('/jobs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'jobs.html'));
});
app.get('/jobssaved', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'savedJobs.html'));
});
app.get('/preferences', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'preferences.html'));
});
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'signin.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'signup.html'));
});
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'profile.html'));
});
app.get('/help', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/', 'help.html'));
});
app.use((req, res, next) => {
  res.status(404).send("Page Not Found");
});

module.exports = app;
