const USER_BASE_MODEL = require("../models/user.model.js");

const listJobs=async(req, res)=>{
    try{
        const userId = req.user.sub;
        console.log(userId)
        const user = await USER_BASE_MODEL.findById(userId);
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
                'x-rapidapi-key': '8bb0b33c9fmsh5db3bc8c9645717p107dfdjsna5195e6d6c9e',
                'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
            }
        };
        const response = await fetch(url, options);
        const result = await response.json();
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
 
}
function extractGeoId(urn) {
    console.log(urn)
    const match = urn?.match(/geo:(\d+)/);
    return match ? match[1] : null;
}

module.exports = {
    listJobs
}