const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  linkedInId: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  name: { type: String },
  mobile: { type: String },
  headline: { type: String }, // e.g. "Software Engineer at XYZ"
  location: { type: String },
  preferences: {
    jobTypes: [String], // e.g. ['Full-time', 'Remote']
    industries: [String], // e.g. ['Tech', 'Finance']
    locations: [String], // e.g. ['New York', 'Kenya']
    experienceLevel: String, // e.g. "Mid", "Senior"
    experienceYears: String // e.g. "0-1", "1-3", "3-5", "5+"
  },
  savesJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SavedJob' }],
  appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AppliedJob' }],
  resume: { title: String, fileUrl: String }
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);