document.addEventListener("DOMContentLoaded", async function () {
    // populate form fields with current job preferences
    const userId = decodeAuthToken().sub;
    let jobPreferences = await fetchUserData(userId);
    jobPreferences = jobPreferences.preferences;
    console.log(jobPreferences);

    const form = document.getElementById("preferences-form");
    document.getElementById("jobTitle").value = jobPreferences?.jobTitle || '';
    document.getElementById("jobType").value = jobPreferences?.jobType || '';
    const location = JSON.parse(jobPreferences?.location)
    document.getElementById("location-input").value = location.name || '';

    // form submission
    form.addEventListener('submit', async(e) => {
        e.preventDefault();
        const jobTitle = document.getElementById("jobTitle").value.trim();
        const jobType = document.getElementById("jobType").value.trim();
        const location = document.getElementById("hidden-location-data").value;
        console.log(location)
        if (!jobTitle ||!jobType ||!location) {
            alert('Please fill all fields');
            return;
        };
        const updatedJobPreferences = {
            preferences: {
                jobTitle,
                jobType,
                location
            }
        };
        fetch(`/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("swipe.match.hired-accessToken")}`
            },
            body: JSON.stringify(updatedJobPreferences)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("User data updated successfully:", data);
            alert("Profile updated successfully!");
        })
        .catch(error => {
            console.error("Error updating user data:", error);
            alert("Failed to update profile. Please try again.");
        });
    })
})