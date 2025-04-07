document.addEventListener("DOMContentLoaded", async function () {
    // populate form fields with current job preferences
    let user = await fetchUserData();
    if (!user) {
        throw new Error("User not authenticated");
    }
    const form = document.getElementById("preferences-form");
    const jobPreferences = user.preferences;
    if (jobPreferences) {
        console.log(jobPreferences);
    
        document.getElementById("jobTitle").value = jobPreferences?.jobTitle || '';
        document.getElementById("jobType").value = jobPreferences?.jobType || '';
        const location = JSON.parse(jobPreferences?.location)
        document.getElementById("location-input").value = location.name || '';
        document.getElementById("hidden-location-data").value = JSON.stringify(location) || '';
    }

    // form submission
    form.addEventListener('submit', async(e) => {
        if (!user) {
            alert("Sign in to save your preferences");
            return;
        }else{
            e.preventDefault();
            const jobTitle = document.getElementById("jobTitle").value.trim();
            const jobType = document.getElementById("jobType").value.trim();
            const location = document.getElementById("hidden-location-data").value;
            console.log(jobTitle,jobType,location)
            if (!jobTitle ||!jobType ) {
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
            fetch(`/api/users/${user._id}`, {
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
                window.location.href = "/jobs";
            })
            .catch(error => {
                console.error("Error updating user data:", error);
                alert("Failed to update profile. Please try again.");
            });
        }
    })
})