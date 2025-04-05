document.addEventListener("DOMContentLoaded", async function () {
    const userId = decodeAuthToken().sub;
    const userData = await fetchUserData(userId);
    console.log("User Data:", userData);
    // fill user details in form
    document.getElementById("profile").textContent  = userData.name;
    document.getElementById("profile-headline").textContent = userData.headline || 'N/A';

    document.getElementById("name").value = userData.name;
    document.getElementById("email").value = userData.email;
    document.getElementById("mobile").value = userData.mobile;
    document.getElementById("location").value = userData.location || 'N/A';
    document.getElementById("linkedin").value = userData.linkedInUrl || 'N/A';
    document.getElementById("headline").value = userData.headline || 'N/A';

    // update user details on form submit
    const form = document.getElementById("profile-form");
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const location = document.getElementById("location").value.trim();
        const linkedin = document.getElementById("linkedin").value.trim();
        const headline = document.getElementById("headline").value.trim();
        if (!name ||!email ||!mobile) {
            alert("Please fill in all required fields");
            return;
        }
        const updatedUserData = {
            name,
            email,
            mobile,
            location,
            linkedInUrl: linkedin,
            headline
        };
        fetch(`http://localhost:3000/api/users/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("swipe.match.hired-accessToken")}`
            },
            body: JSON.stringify(updatedUserData)
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
});