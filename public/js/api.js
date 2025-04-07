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
        // console.log("Job Listings:", data.data);
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
    if (!decodeAuthToken()) {
        alert("Please sign in or create an account");
        throw new Error("User not authenticated");
    }
    const token = localStorage.getItem('swipe.match.hired-accessToken');
    const userId = decodeAuthToken().sub;
    try {
        const response = await fetch(`/api/users/${userId}`,{
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
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