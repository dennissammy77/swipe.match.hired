const USER_BASE_MODEL = require("../models/user.model.js");

const listJobs=async(req, res)=>{
    try{
        const userId = req.user.sub;
        console.log(userId)
        const user = await USER_BASE_MODEL.findById(userId,{preferences:1,savedJobs:1});
        // pass user details to fetch job data from jobcontroller
        const jobTitle = user.preferences.jobTitle;
        const location = extractGeoId(JSON.parse(user.preferences.location).id);
        if(!jobTitle ||!location){
            return res.status(400).json({error: true, message: 'Job title and location are required.'});
        }
        const url = `https://linkedin-api8.p.rapidapi.com/search-jobs-v2?keywords=${jobTitle}&locationId=${location}&datePosted=anyTime&sort=mostRelevant`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.VITE_RAPIDAPI_KEY,
                'x-rapidapi-host': process.env.VITE_RAPIDAPI_HOST
            }
        };
        const response = await fetch(url, options);
        const result = await response.json();
        // attach if job is saved from user saved lists
        const savedJobs = user.savedJobs.map(job => job.jobId);
        result.data.forEach(job => {
            job.saved = savedJobs.includes(job.id);
        });
        if (result && result.data.length > 0) {
            return res.status(200).json({error: false, data: result.data});
        }else {
            return res.status(200).json({error: false, data: []});
        }
        // return res.status(200).json({error: false, data: []});
    } catch(error){
        console.error('Error fetching jobs:', error);
        return res.status(500).json({
            error: true,
            message: 'Error occured while fetching jobs.'
        });
    }
};

const savedJob=async(req,res)=>{
    try{
        const userId = req.user.sub;
        const jobToSave = req.body; // assuming it includes jobId and maybe job data
        const jobIdToSave = jobToSave.jobId;

        console.log(userId)
        // const user = await USER_BASE_MODEL.findByIdAndUpdate(userId, {$push: {savedJobs: req.body}}, {new: true});
        const user = await USER_BASE_MODEL.findById(userId,{savedJobs:1});
        if (!user){
            return res.status(200).send({error:true,message:'This User does not have an existing account'});
        }
        const jobAlreadySaved = user.savedJobs.some(job => job.jobId === jobIdToSave);

        if (jobAlreadySaved) {
            return res.status(200).json({ error: true, message: 'Job is already saved' });
        }

        // Push new job and update user
        user.savedJobs.push(jobToSave);
        await user.save();
        console.log('Job saved successfully');

        return res.status(200).send({
            error: false,
            message: 'Job saved successfully'
        });
    }catch(err){
        console.error('error saving job:', err);
        return res.status(500).json({
            error: true,
            message: 'Error occured while saving job.'
        });
    }
};

function extractGeoId(urn) {
    console.log(urn)
    const match = urn?.match(/geo:(\d+)/);
    return match ? match[1] : null;
}

module.exports = {
    listJobs,
    savedJob
}