// api calls
async function fetchJobListings() {
    try {
        // attach jwt auth token to fecth
        const token = localStorage.getItem('swipe.match.hired-accessToken');
        if (!token) {
            alert("Please sign in or create an account");
            throw new Error("User not authenticated");
        }
        const requestOptions = {
            method: 'GET',
            headers : {
                'Authorization': `Bearer ${token}`,
            }            
        };
        const response = await fetch("/api/jobs",requestOptions);
        if (!response.ok) {
            throw new Error("Failed to fetch job listings");
        }
        const data = await response.json();
        console.log("Job Listings:", data.data);
        return data.data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
};
async function saveJob(payload){
    try {
        const token = localStorage.getItem('swipe.match.hired-accessToken');
        if (!token) {
            alert("Please sign in or create an account");
            throw new Error("User not authenticated");
        }
        const requestOptions = {
            method: 'PUT',
            headers : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        };
        const response = await fetch("/api/jobs/save", requestOptions);
        if (!response.ok) {
            throw new Error("Failed to save job");
        }
        const data = await response.json();
        console.log(data.message);
        return alert(data.message)
    } catch (error) {
        console.error("Error saving job:", error);
    }
}
async function fetchListings(){
    // localStorage.setItem('jobTitle', JSON.stringify(jobTitle));
    // jobTitle,location='100710459'
    // https://linkedin-api8.p.rapidapi.com/search-jobs-v2?keywords=golang&locationId=92000000&datePosted=anyTime&sort=mostRelevant

    // fetch  job preferences from user data
    const userId = decodeAuthToken().sub;
    if(!userId){
        alert("Please sign in or cleate an account");
        throw new Error("User not authenticated");
    }
    const userData = await fetchUserData(userId);
    const jobTitle = userData.preferences.jobTitle;
    const location = extractGeoId(userData.preferences.location);
    if(!jobTitle || !location){
        alert("Please provide job title and location in your job preferences");
        throw new Error("Job title or location not provided");
    };
    console.log(jobTitle, location)
    const url = `https://linkedin-api8.p.rapidapi.com/search-jobs-v2?keywords=${jobTitle}&locationId=${location}&datePosted=anyTime&sort=mostRelevant`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '8bb0b33c9fmsh5db3bc8c9645717p107dfdjsna5195e6d6c9e',
        'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
      }
    };
    
    try {
        // omly make request the first time
        if(!localStorage.getItem('jobListings')){
            const response = await fetch(url, options);
            const result = await response.json();
            if (result && result.data.length > 0) {
                // Get the first 100 jobs or fewer if there aren't that many
                // const first100Jobs = result.data.slice(0, 100);
        
                // Store in localStorage
                localStorage.setItem('jobListings', JSON.stringify(result.data));
        
                // console.log('Jobs stored in localStorage:', result.data);
            } else {
                console.log('No jobs found.');
            }
        }
    } catch (error) {
        console.error(error);
    }
};
// decode authToken
function decodeAuthToken() {
    const token = localStorage.getItem("swipe.match.hired-accessToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload) return null;
    return payload;
}
// fetchListings('Full Stack developer')
async function fetchUserData() {
    const userId = decodeAuthToken().sub;
    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("User Data:", data);
        return data.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}
function extractGeoId(urn) {
    // urn = JSON.parse(urn)
    console.log(urn)
    const match = urn.match(/geo:(\d+)/);
    return match ? match[1] : null;
}