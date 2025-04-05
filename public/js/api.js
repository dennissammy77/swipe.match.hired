// api calls
async function fetchJobListings() {
    try {
        const response = await fetch("http://localhost:3000/api/jobs");
        if (!response.ok) {
            throw new Error("Failed to fetch job listings");
        }
        const data = await response.json();
        console.log("Job Listings:", data);
        return data;
    } catch (error) {
        console.error("Error fetching jobs:", error);
    }
}
async function fetchListings(jobTitle){
    localStorage.setItem('jobTitle', JSON.stringify(jobTitle));
    // https://linkedin-api8.p.rapidapi.com/search-jobs-v2?keywords=golang&locationId=92000000&datePosted=anyTime&sort=mostRelevant

    const url = `https://linkedin-api8.p.rapidapi.com/search-jobs-v2?keywords=${jobTitle}&locationId=100710459&datePosted=anyTime&sort=mostRelevant`;
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
                const first100Jobs = result.data.slice(0, 100);
        
                // Store in localStorage
                localStorage.setItem('jobListings', JSON.stringify(first100Jobs));
        
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
async function fetchUserData(userId) {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
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