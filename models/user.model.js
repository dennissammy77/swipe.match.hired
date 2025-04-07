const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  linkedInUrl: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  name: { type: String },
  profile_url: { type: String },
  mobile: { type: String },
  headline: { type: String }, // e.g. "Software Engineer at XYZ"
  location: { type: String },
  preferences: {
    jobTitle: String, // e.g. Full stack developer
    jobType: String, // e.g. ['Full-time', 'Remote']
    location: { id: String, name: String}, // e.g. ['New York', 'Kenya']
    experienceLevel: String, // e.g. "Mid", "Senior"
    experienceYears: String // e.g. "0-1", "1-3", "3-5", "5+"
  },
  savedJobs: [
    {
      jobId: String,
      jobDetails: String,
      savedAt: Date,
      coverLetter: String, // cover letter created by AI
      resumeUrl: String, // resume created by AI
      atsScore: Number, // score created by AI
      status: String // e.g. "Applied", "Interviewed", "Offered", "Declined"
    }
  ],
  resume: { title: String, fileUrl: String }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);